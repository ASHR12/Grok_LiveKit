import os
import asyncio
from typing import Annotated
from livekit.agents import JobContext, WorkerOptions, cli, JobProcess, llm
from livekit.agents.llm import ChatContext, ChatMessage
import logging
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import deepgram, silero, openai, elevenlabs
from dotenv import load_dotenv
import aiohttp
from datetime import datetime, timedelta, timezone

# Load environment variables
load_dotenv()

# Set up logging
logger = logging.getLogger("weather-demo")
logger.setLevel(logging.INFO)

def identify_flight_code_type(voice_input):
    # Clean the input
    cleaned_input = voice_input.replace(" ", "").upper()
    
    # Split letters and numbers
    letters = ''.join(c for c in cleaned_input if c.isalpha())
    numbers = ''.join(c for c in cleaned_input if c.isdigit())
    
    # Identify type based on letter count and presence of numbers
    if len(letters) == 2 and len(numbers) > 0:
        return "IATA_FLIGHT", letters + numbers  # Example: MU2557
    elif len(letters) == 3 and len(numbers) > 0:
        return "ICAO_FLIGHT", letters + numbers  # Example: CES2557
    elif len(letters) == 3 and len(numbers) == 0:
        return "IATA_AIRLINE_CODE", letters      # Example: AAL
    elif len(letters) == 4 and len(numbers) == 0:
        return "ICAO_AIRLINE_CODE", letters      # Example: ICAO
    else:
        return "UNKNOWN", None

class AssistantFnc(llm.FunctionContext):
    """
    The class defines a set of LLM functions that the assistant can execute.
    """

    @llm.ai_callable()
    async def get_weather(
        self,
        location: Annotated[str, llm.TypeInfo(description="The location to get the weather for")],
    ):
        """Called when the user asks about the weather."""
        logger.info(f"Getting weather for {location}")
        url = f"https://wttr.in/{location}?format=%C+%t"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    weather_data = await response.text()
                    logger.info(f"Weather value is {weather_data}")

                    # Separate description and temperature safely
                    description, temperature = weather_data.rsplit(" ", 1)

                    # Remove "°C" from the temperature and handle signs
                    temperature = temperature.replace("°C", "")
                    if temperature.startswith("+"):
                        temp_text = f"{temperature[1:]} degrees Celsius"
                    elif temperature.startswith("-"):
                        temp_text = f"negative {temperature[1:]} degrees Celsius"
                    else:
                        temp_text = f"{temperature} degrees Celsius"

                    # Format the final sentence for TTS
                    tts_text = f"The weather in {location} is {description.lower()} with a temperature of {temp_text}."
                    return tts_text
                else:
                    raise ValueError(f"Failed to get weather data, status code: {response.status}")

    @llm.ai_callable()
    async def get_flight_status(
        self,
        flight_number: Annotated[str, llm.TypeInfo(description="The flight number to check the status for")]
    ):
        """Called when the user asks for a flight's status."""
        flight_type, flight_code = identify_flight_code_type(flight_number)

        if flight_type == "UNKNOWN":
            return "I'm sorry, but I couldn't determine the correct format of the flight number."

        query_param = "flight_iata" if flight_type == "IATA_FLIGHT" else "flight_icao"
        url = f"https://api.aviationstack.com/v1/flights?access_key={os.getenv('AVIATION_STACK_API_KEY')}&{query_param}={flight_code}"

        logger.info(f"Getting flight status for {flight_code} using {query_param}")

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    flight_data = await response.json()
                    if "data" in flight_data and flight_data["data"]:
                        flight = flight_data["data"][0]

                        # Format departure time
                        scheduled_departure = datetime.fromisoformat(flight["departure"]["scheduled"].replace('Z', '+00:00'))
                        formatted_departure = scheduled_departure.strftime("%I:%M %p")
                        departure_utc_offset = scheduled_departure.astimezone(timezone.utc).strftime("%z")

                        # Format arrival time
                        scheduled_arrival = datetime.fromisoformat(flight["arrival"]["scheduled"].replace('Z', '+00:00'))
                        formatted_arrival = scheduled_arrival.strftime("%I:%M %p")
                        arrival_utc_offset = scheduled_arrival.astimezone(timezone.utc).strftime("%z")

                        # Build the status message
                        status_message = (
                            f"Flight {flight_code} operated by {flight['airline']['name']} "
                            f"from {flight['departure']['airport']} ({flight['departure']['iata']}) "
                            f"to {flight['arrival']['airport']} ({flight['arrival']['iata']}) "
                            f"is currently {flight['flight_status']}. "
                        )

                        # Add departure/arrival details
                        status_message += (
                            f"Scheduled departure at {formatted_departure} UTC{departure_utc_offset} "
                            f"{f' from Terminal {flight['departure']['terminal']}' if flight['departure']['terminal'] else ''} "
                            f"{f' Gate {flight['departure']['gate']}' if flight['departure']['gate'] else ''}. "
                            f"Scheduled arrival at {formatted_arrival} UTC{arrival_utc_offset} "
                            f"{f' at Terminal {flight['arrival']['terminal']}' if flight['arrival']['terminal'] else ''} "
                            f"{f' Gate {flight['arrival']['gate']}' if flight['arrival']['gate'] else ''}. "
                        )

                        # Add delay information if any
                        if flight['departure']['delay']:
                            status_message += f"Departure delayed by {flight['departure']['delay']} minutes. "
                        if flight['arrival']['delay']:
                            status_message += f"Arrival delayed by {flight['arrival']['delay']} minutes. "

                        # Add live tracking information if available
                        if "live" in flight and flight["live"]:
                            status_message += (
                                f"{'Aircraft is on the ground.' if flight['live']['is_ground'] else 'Aircraft is in the air.'} "
                            )

                        return status_message.strip()
                    else:
                        return f"No flight information available for flight {flight_code}."
                else:
                    return f"Unable to retrieve flight information. Please try again later."

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()

async def entrypoint(ctx: JobContext):
    print(f"Room Name: {ctx.room.name}")
    initial_ctx = ChatContext(
        messages=[
            ChatMessage(
                role="system",
                content="You are a voice assistant created by xAI team. Your name is Grok. "
                        "Pretend we're having a human conversation, no special formatting or headings, just natural speech. "
                        "You can also provide the latest weather report based on user-given location and provide flight status based on just flight code or flight number.",
            )
        ]
    )

    # Define llm
    grok = openai.LLM(
        base_url="https://api.x.ai/v1",
        api_key=os.getenv("GROK_API_KEY"),
        model="grok-beta"
    )

    # Define TTS
    voice = elevenlabs.Voice(
        id="nPczCjzI2devNBz1zQrb", name="Brian", category="premade"
    )
    elevenlabs_tts = elevenlabs.TTS(model_id="eleven_multilingual_v2", voice=voice)

    assistant = VoiceAssistant(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(),
        llm=grok,
        tts=elevenlabs_tts,
        fnc_ctx=AssistantFnc(),
        chat_ctx=initial_ctx,
    )

    await ctx.connect()
    assistant.start(ctx.room)
    await asyncio.sleep(1)
    await assistant.say("Hi I am Grok, I can chat, help you with weather information and flight status", allow_interruptions=True)

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
