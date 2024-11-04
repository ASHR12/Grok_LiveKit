import { Button } from '@/components/button/Button'
import { LoadingSVG } from '@/components/button/LoadingSVG'
import { SettingsDropdown } from '@/components/playground/SettingsDropdown'
import { useConfig } from '@/hooks/useConfig'
import { ConnectionState } from 'livekit-client'
import { ReactNode } from 'react'

type PlaygroundHeader = {
  logo?: ReactNode
  title?: ReactNode
  githubLink?: string
  height: number
  accentColor: string
  connectionState: ConnectionState
  onConnectClicked: () => void
}

export const PlaygroundHeader = ({
  logo,
  title,
  githubLink,
  accentColor,
  height,
  onConnectClicked,
  connectionState,
}: PlaygroundHeader) => {
  const { config } = useConfig()
  return (
    <div
      className={`flex gap-4 pt-4 text-${accentColor}-500 justify-between items-center shrink-0`}
      style={{
        height: height + 'px',
      }}
    >
      <div className='flex items-center gap-3 basis-2/3'>
        <div className='flex lg:basis-1/2'>
          <a href='https://www.ashutoshai.com'>{logo ?? <GrokLogo />}</a>
        </div>
        <div className='lg:basis-1/2 lg:text-center text-xs lg:text-base lg:font-semibold text-white'>
          {title}
        </div>
      </div>
      <div className='flex basis-1/3 justify-end items-center gap-2'>
        {githubLink && (
          <a
            href={githubLink}
            target='_blank'
            className={`text-white hover:text-white/80`}
          >
            <GithubSVG />
          </a>
        )}
        {config.settings.editable && <SettingsDropdown />}
        <Button
          accentColor={
            connectionState === ConnectionState.Connected ? 'red' : accentColor
          }
          disabled={connectionState === ConnectionState.Connecting}
          onClick={() => {
            onConnectClicked()
          }}
        >
          {connectionState === ConnectionState.Connecting ? (
            <LoadingSVG />
          ) : connectionState === ConnectionState.Connected ? (
            'Disconnect'
          ) : (
            'Connect'
          )}
        </Button>
      </div>
    </div>
  )
}

const LKLogo = () => (
  <svg
    width='28'
    height='28'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g clipPath='url(#clip0_101_119699)'>
      <path
        d='M19.2006 12.7998H12.7996V19.2008H19.2006V12.7998Z'
        fill='currentColor'
      />
      <path
        d='M25.6014 6.40137H19.2004V12.8024H25.6014V6.40137Z'
        fill='currentColor'
      />
      <path
        d='M25.6014 19.2002H19.2004V25.6012H25.6014V19.2002Z'
        fill='currentColor'
      />
      <path d='M32 0H25.599V6.401H32V0Z' fill='currentColor' />
      <path d='M32 25.5986H25.599V31.9996H32V25.5986Z' fill='currentColor' />
      <path
        d='M6.401 25.599V19.2005V12.7995V6.401V0H0V6.401V12.7995V19.2005V25.599V32H6.401H12.7995H19.2005V25.599H12.7995H6.401Z'
        fill='white'
      />
    </g>
    <defs>
      <clipPath id='clip0_101_119699'>
        <rect width='32' height='32' fill='white' />
      </clipPath>
    </defs>
  </svg>
)

const GrokLogo = () => (
  <svg
    width='50'
    height='50'
    viewBox='0 0 1600 1600'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g clipPath='url(#clip0)'>
      <path
        transform='translate(1027,338)'
        d='m0 0h194l-2 5-8 11-11 16-10 14-11 16-13 19-21 30-12 17-11 16-13 18-11 16-10 15-1 2h197l316 1v55l-56 1-1 55-1 1-26 1h-30v56l-3 1-53 1-1 55-7 1h-50v55l-1 2h-341l-1-26v-31h-56l-1-1-1-56-4 1-8 9-14 20-15 22-16 23-10 14-14 20-13 19-8 11-13 19-11 15-11 16-24 34-13 19-13 18-28 40-12 17-28 40-11 16-14 20-24 34-16 23-13 19-36 51-16 23-11 15-1 1-13 1h-161l-20-1 2-4 10-14 15-22 12-17 14-20 12-17 13-19 13-18 11-16 12-17 35-50 12-17 10-14 8-12 10-14 7-10 13-19 24-34 13-19 8-11 13-19 13-18 13-19 10-14 13-19 13-18 9-13 12-17 13-19 12-17 10-14 16-23 13-19 14-19 15-22 12-17 12-18 2-4h-106l1 3-1 53-14 1h-43v56l-3 1h-54v56l-3 1h-54v56l-1 1h-341l-1-33v-24h-56l-1-1v-56h-56l-1-1v-56h-57l-1-56-1-1-56-1v-55l36-1h665l189-1 9-11 12-18 8-11 11-16 14-20 11-16 10-14 28-40 12-17 13-19zm-855 251-1 4v54l57 1 1 56 13 1h40l3-1 1 57 3 1h54l1-1v-56h55l2-1v-50l-1-7-17-1h-39v-52l-1-5h-57l-1 38v19h-55l-1-56-1-1zm800 0-1 2v56l37 1h20l1 56 4 1h49l3-1 1 57 4 1h53l1-1v-56h55l2-1v-57l-5-1h-52v-56l-1-1h-57l-1 36v21h-55v-53l-1-4z'
        fill='currentColor'
      />
      <path
        transform='translate(341,647)'
        d='m0 0 2 1v55l-1 1h-55l-1-2v-54z'
        fill='currentColor'
      />
      <path
        transform='translate(1087,648)'
        d='m0 0h56v55l-1 1h-55l-1-2v-53z'
        fill='currentColor'
      />
    </g>
    <defs>
      <clipPath id='clip0'>
        <rect width='1600' height='1600' fill='white' />
      </clipPath>
    </defs>
  </svg>
)

const GithubSVG = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 98 96'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z'
      fill='currentColor'
    />
  </svg>
)
