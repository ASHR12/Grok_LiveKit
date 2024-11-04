# Grok LiveKit Agents Playground

<!--BEGIN_DESCRIPTION-->

The Agent Playground is modified version of Agent playground provided by LiveKit [LiveKit Agents Framework](https://github.com/livekit/agents). Easily tap into LiveKit WebRTC sessions and process or generate audio, video, and data streams.
The playground includes components to fully interact with any LiveKit agent, through video, audio and chat.

<!--END_DESCRIPTION-->

## Docs and references

Docs for how to get started with LiveKit agents at [https://docs.livekit.io/agents](https://docs.livekit.io/agents)

The repo containing the (server side) agent implementations (including example agents): [https://github.com/livekit/agents](https://github.com/livekit/agents)

## Try out a live version

You can try out the agents playground at [https://livekit-agent-playground.vercel.app](https://livekit-agent-playground.vercel.app).
This will connect you to our example agent, KITT, which is based off of the [minimal-assistant](https://github.com/livekit/agents/blob/main/examples/voice-pipeline-agent/minimal_assistant.py).

## Setting up the playground locally

1. Install dependencies

```bash
  npm install
```

1. Create `.env.local` and fill in the necessary environment variables.

```
# LiveKit API Configuration
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=

# Public configuration
NEXT_PUBLIC_LIVEKIT_URL=

# Application Configuration
NEXT_PUBLIC_APP_CONFIG="
title: 'Grok Voice Assitant - Powered by LiveKit'
description: 'Grok Voice Assistant is a project that integrates voice interaction capabilities using LiveKit, Deepgram, ElevenLabs, and OpenAI compatabile llm API of Livekit.'
github_link: 'https://github.com/ASHR12/Grok_LiveKit'
video_fit: 'cover' # 'contain' or 'cover'
settings:
  editable: true # Should the user be able to edit settings in-app
  theme_color: 'cyan'
  chat: true  # Enable or disable chat feature
  outputs:
    audio: true # Enable or disable audio output
    video: true # Enable or disable video output
  inputs:
    mic: true    # Enable or disable microphone input
    camera: true # Enable or disable camera input
    sip: true    # Enable or disable SIP input
"
```

3. Run the development server:

```bash
  npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
5. If you haven't done so yet, start your agent (with the same project variables as in step 2.)
6. Connect to a room and see your agent connecting to the playground

## Features

- audio and chat from your agent
- audio, or text to your agent
- Configurable settings panel to work with your agent
