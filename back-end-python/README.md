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

5. create .env file and update this value :

   ```bash
   LIVEKIT_URL=
   LIVEKIT_API_KEY=A
   LIVEKIT_API_SECRET=
   DEEPGRAM_API_KEY=
   CARTESIA_API_KEY= // not used in code
   CEREBRAS_API_KEY= // not used in code
   ELEVEN_API_KEY=
   GROK_API_KEY=
   AVIATION_STACK_API_KEY= WIP for flight status agents.
   ```

6. Run application :
   python main.py dev

### Note:

agent.py is work in progress : so that code might not work .
