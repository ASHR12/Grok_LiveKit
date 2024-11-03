import os
import asyncio

from livekit.agents import JobContext, WorkerOptions, cli, JobProcess
from livekit.agents.llm import (
    ChatContext,
    ChatMessage,
)
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import deepgram, silero, cartesia, openai , elevenlabs

from dotenv import load_dotenv

load_dotenv()


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    initial_ctx = ChatContext(
        messages=[
            ChatMessage(
                role="system",
                content="You are a voice assistant created by xAI team, Your name is Grok. Pretend we're having a human conversation, no special formatting or headings, just natural speech.",
            )
        ]
    )

    voice = elevenlabs.Voice(
        id="nPczCjzI2devNBz1zQrb", name="Brian", category="premade"
    )

    assistant = VoiceAssistant(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(),
        llm=openai.LLM(
            base_url="https://api.x.ai/v1",
            api_key=os.getenv("GROK_API_KEY"),
            model="grok-beta"
        ),
        # tts=cartesia.TTS(voice="248be419-c632-4f23-adf1-5324ed7dbf1d"),
        tts = elevenlabs.TTS(model_id="eleven_multilingual_v2", voice=voice),
        chat_ctx=initial_ctx,
    )

    await ctx.connect()
    assistant.start(ctx.room)
    await asyncio.sleep(1)
    await assistant.say("Hi I am Grok, how can i help you today?", allow_interruptions=True)


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
