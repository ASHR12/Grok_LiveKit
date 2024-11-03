'use client'

import {
  LiveKitRoom,
  useVoiceAssistant,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  AgentState,
  DisconnectButton,
} from '@livekit/components-react'
import { useCallback, useEffect, useState } from 'react'
import { MediaDeviceFailure } from 'livekit-client'
import type { ConnectionDetails } from './api/connection-details/route'
import { NoAgentNotification } from '@/components/NoAgentNotification'
import { CloseIcon } from '@/components/CloseIcon'
import { useKrispNoiseFilter } from '@livekit/components-react/krisp'
import Image from 'next/image'

export default function Page() {
  const [connectionDetails, updateConnectionDetails] = useState<
    ConnectionDetails | undefined
  >(undefined)
  const [agentState, setAgentState] = useState<AgentState>('disconnected')

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ??
        '/api/connection-details',
      window.location.origin
    )
    const response = await fetch(url.toString())
    const connectionDetailsData = await response.json()
    updateConnectionDetails(connectionDetailsData)
  }, [])

  return (
    <main
      data-lk-theme='default'
      className='relative h-full grid content-center bg-[var(--lk-bg)]'
    >
      <header className='text-center mb-8'>
        <h1 className='text-5xl font-bold text-white'>Grok Voice Assistant</h1>
        <p className='text-xl text-gray-300 mt-2'>
          Powered by Deepgram, ElevenLabs, and LiveKit
        </p>
      </header>

      <LiveKitRoom
        token={connectionDetails?.participantToken}
        serverUrl={connectionDetails?.serverUrl}
        connect={connectionDetails !== undefined}
        audio={true}
        video={false}
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={() => {
          updateConnectionDetails(undefined)
        }}
        className='grid grid-rows-[2fr_1fr] items-center'
      >
        <SimpleVoiceAssistant
          onStateChange={setAgentState}
          agentState={agentState}
        />
        <ControlBar
          onConnectButtonClicked={onConnectButtonClicked}
          agentState={agentState}
        />
        <RoomAudioRenderer />
        <NoAgentNotification state={agentState} />
      </LiveKitRoom>

      <footer className='absolute bottom-0 w-full text-center py-4 text-gray-400'>
        Grok for LLM • Deepgram for STT • ElevenLabs for TTS
      </footer>
    </main>
  )
}

function SimpleVoiceAssistant(props: {
  onStateChange: (state: AgentState) => void
  agentState: AgentState
}) {
  const { state } = useVoiceAssistant()
  useEffect(() => {
    props.onStateChange(state)
  }, [props, state])
  return (
    <div className='flex justify-center items-center h-[300px]'>
      <div
        className={`relative w-32 h-32 ${
          state === 'speaking' ? 'center-glow-animation' : 'bg-floralWhite'
        }`}
      >
        <Image
          src='/grok-icon.png'
          alt='Grok Icon'
          width={128}
          height={128}
          className='object-contain z-10 relative'
        />
      </div>
    </div>
  )
}

function ControlBar(props: {
  onConnectButtonClicked: () => void
  agentState: AgentState
}) {
  /**
   * Use Krisp background noise reduction when available.
   * Note: This is only available on Scale plan, see {@link https://livekit.io/pricing | LiveKit Pricing} for more details.
   */
  const krisp = useKrispNoiseFilter()
  useEffect(() => {
    krisp.setNoiseFilterEnabled(true)
  }, [])

  return (
    <div className='relative h-[100px]'>
      {props.agentState === 'disconnected' && (
        <button
          className='uppercase absolute left-1/2 transform -translate-x-1/2 px-6 py-3 bg-floral_white text-xl text-eerie_black rounded-full shadow-lg hover:shadow-xl hover:bg-timberwolf transition duration-300'
          onClick={() => props.onConnectButtonClicked()}
        >
          Grok On...
        </button>
      )}
      {props.agentState !== 'disconnected' &&
        props.agentState !== 'connecting' && (
          <div className='flex h-8 absolute left-1/2 transform -translate-x-1/2 justify-center'>
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton>
              <CloseIcon />
            </DisconnectButton>
          </div>
        )}
    </div>
  )
}

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error)
  alert(
    'Error acquiring microphone permissions. Please grant the necessary permissions in your browser and reload the page.'
  )
}
