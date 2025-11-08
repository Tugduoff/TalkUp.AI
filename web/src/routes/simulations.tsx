import { Button } from '@/components/atoms/button';
import InfoBox from '@/components/molecules/info-box';
import { InputMolecule } from '@/components/molecules/input-molecule';
import SimulationTranscriptionArea from '@/components/organisms/simulation-transcription-area';
import { TranscriptionProps } from '@/components/organisms/simulation-transcription-area/types';
import SimulationVideoArea from '@/components/organisms/simulation-video-area';
import { createAuthGuard } from '@/utils/auth.guards';
import { cn } from '@/utils/cn';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const Route = createFileRoute('/simulations')({
  beforeLoad: createAuthGuard('/simulations'),
  component: Simulations,
});

/**
 * Simulations Page Component
 * @returns The Simulations page component.
 */
function Simulations() {
  // WebSocket configuration state
  const [inputUrl, setInputUrl] = useState('wss://echo.websocket.org');
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket opened'),
    onClose: (closeEvent: CloseEvent) => {
      console.log(
        'WebSocket closed with code:',
        closeEvent.code,
        'reason:',
        closeEvent.reason,
      );
    },
    shouldReconnect: (closeEvent: CloseEvent) => {
      const shouldReconnect =
        closeEvent.code !== 1000 && closeEvent.code !== 1001;
      console.log(
        'shouldReconnect:',
        shouldReconnect,
        'code:',
        closeEvent.code,
      );
      return shouldReconnect;
    },
  });

  // Connect/disconnect websocket based on call state
  const handleStreamToggle = useCallback(
    (streaming: boolean) => {
      setIsCallActive(streaming);
      if (streaming) {
        // Connect websocket when call starts
        setSocketUrl(inputUrl);
      } else {
        // Disconnect websocket when call ends
        getWebSocket()?.close(1000, 'Call ended');
        setSocketUrl(null);
      }
    },
    [inputUrl, getWebSocket],
  );

  const readyStateRecord: Record<ReadyState, { label: string; color: string }> =
    {
      [ReadyState.CONNECTING]: {
        label: 'Connecting',
        color: 'text-yellow-600',
      },
      [ReadyState.OPEN]: { label: 'Connected', color: 'text-green-600' },
      [ReadyState.CLOSING]: { label: 'Closing', color: 'text-red-600' },
      [ReadyState.CLOSED]: { label: 'Closed', color: 'text-red-600' },
      [ReadyState.UNINSTANTIATED]: {
        label: 'Uninstantiated',
        color: 'text-gray-600',
      },
    };

  const staticTranscriptions: TranscriptionProps[] = [
    {
      isIA: true,
      speaker: 'AI',
      text: "Hello, thank you for joining me. Let's start the interview.",
    },
    {
      isIA: false,
      speaker: 'You',
      text: "Hello, I'm delighted to be here. I look forward to discussing how my experience can benefit your team.",
    },
    {
      isIA: true,
      speaker: 'AI',
      text: 'Excellent. Can you tell me about a recent project where you faced a particularly difficult technical challenge, and how you overcame it?',
    },
  ];

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Simulations</h1>
          <p className="text-gray-600">
            Simulations let you practice interview scenarios in a safe
            environment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_20rem] gap-6">
        <div>
          <SimulationVideoArea onStreamToggle={handleStreamToggle} />
          <SimulationTranscriptionArea transcriptions={staticTranscriptions} />
        </div>

        <div className="space-y-6">
          {/* WebSocket Configuration Panel (Temporary) */}
          {
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-gray-800">
                WebSocket Connection
              </h2>
              <InputMolecule
                label="Socket URL"
                type="base"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                disabled={isCallActive}
              />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Status:</span>
                <span
                  className={cn(
                    'font-medium',
                    readyStateRecord[readyState].color,
                  )}
                >
                  {readyStateRecord[readyState].label}
                </span>
              </div>
              <p className="text-xs text-gray-500 italic">
                Connection starts when call begins
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={() => sendMessage('Hello WebSocket!')}
                  disabled={readyState !== ReadyState.OPEN}
                  size="sm"
                  variant="contained"
                >
                  Send Message
                </Button>
                <Button
                  onClick={() =>
                    sendJsonMessage({
                      type: 'greet',
                      payload: 'Hello JSON WebSocket!',
                    })
                  }
                  disabled={readyState !== ReadyState.OPEN}
                  size="sm"
                  variant="contained"
                >
                  Send JSON Message
                </Button>
              </div>
            </div>
          }

          {/* WebSocket Messages Display (Temporary) */}
          {lastMessage || lastJsonMessage ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-gray-800">
                WebSocket Messages
              </h2>
              {lastMessage ? (
                <div className="bg-gray-50 rounded p-2 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Last Message:
                  </p>
                  <p className="text-xs text-gray-800 break-all">
                    {String(lastMessage.data)}
                  </p>
                </div>
              ) : null}
              {lastJsonMessage ? (
                <div className="bg-gray-50 rounded p-2 border border-gray-200 max-h-48 overflow-y-auto">
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Last JSON:
                  </p>
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                    {JSON.stringify(
                      lastJsonMessage as Record<string, unknown>,
                      null,
                      2,
                    )}
                  </pre>
                </div>
              ) : null}
            </div>
          ) : null}

          <InfoBox
            title="Statistics Overview"
            text="Real-time statistics will appear here."
            icon="notifications"
          />

          <InfoBox
            title="Real time advice"
            text="Remember to keep your hands above the table"
            icon="check"
          />

          <img src="/avatarworking.png" alt="Avatar Working" />
        </div>
      </div>
    </div>
  );
}
