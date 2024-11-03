# Grok Voice Assistant

Grok Voice Assistant is a project that integrates voice interaction capabilities using LiveKit, Deepgram, ElevenLabs, and OpenAI technologies. It consists of a frontend built with Next.js and a backend powered by Python.

## Project Structure

- **Frontend**: Located in the `frontend-nextjs` directory, this part of the application handles user interactions and displays the voice assistant interface.
- **Backend**: Located in the `back-end-python` directory, this part manages the voice assistant's logic and integrates with various APIs.

## Development Setup

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend-nextjs
   ```

2. Create a `.env.local` file and add the required environment variables to connect to your LiveKit server:

   ```plaintext
   LIVEKIT_API_KEY=
   LIVEKIT_API_SECRET=
   LIVEKIT_URL=
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the local development server:

   ```bash
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000`.

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd back-end-python
   ```

2. Create a virtual environment:

   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:

   ```bash
   source .venv/bin/activate
   ```

4. Install the required packages:

   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file with the following variables:

   ```plaintext
   LIVEKIT_URL=
   LIVEKIT_API_KEY=
   LIVEKIT_API_SECRET=
   DEEPGRAM_API_KEY=
   ELEVEN_API_KEY=
   GROK_API_KEY=
   ```

6. Run the application:
   ```bash
   python main.py dev
   ```

## Usage

Once both the frontend and backend are running, you can interact with the Grok Voice Assistant through the web interface. The assistant is designed to facilitate voice conversations and can be integrated with various voice and language processing services.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. For more details, please refer to the [LICENSE](LICENSE) file, which outlines the terms and conditions of this license.
