import { Button } from '@/components/atoms/button';
import InfoBox from '@/components/molecules/info-box';
import { InputMolecule } from '@/components/molecules/input-molecule';
import SimulationTranscriptionArea from '@/components/organisms/simulation-transcription-area';
import { TranscriptionProps } from '@/components/organisms/simulation-transcription-area/types';
import SimulationVideoArea from '@/components/organisms/simulation-video-area';
import {
  AudioPacket,
  useAudioStreaming,
  useSimulationWebSocket,
} from '@/hooks/simulation';
import { createAuthGuard } from '@/utils/auth.guards';
import { cn } from '@/utils/cn';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ReadyState } from 'react-use-websocket';

export const Route = createFileRoute('/simulations')({
  beforeLoad: createAuthGuard('/simulations'),
  component: Simulations,
});

function Simulations() {
  const [inputUrl, setInputUrl] = useState('ws://localhost:8080');
  const [isCallActive, setIsCallActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [wsError, setWsError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  const {
    sendMessage,
    sendJsonMessage,
    sendPing,
    lastMessage,
    lastJsonMessage,
    readyState,
    connect,
    disconnect,
  } = useSimulationWebSocket({
    defaultUrl: inputUrl,
    onOpen: () => {
      setWsError(null);
      setConnectionAttempts(0);
    },
    onClose: (event) => {
      if (event.code !== 1000 && event.code !== 1001) {
        setWsError(
          `Connection closed: ${event.code} - ${event.reason || 'Unknown reason'}`,
        );
      }
    },
    onError: () => {
      setConnectionAttempts((prev) => prev + 1);
      setWsError(
        'Failed to connect to WebSocket server. Check URL and server status.',
      );
    },
  });

  const sendJsonMessageRef = useRef(sendJsonMessage);
  const readyStateRef = useRef(readyState);

  useEffect(() => {
    sendJsonMessageRef.current = sendJsonMessage;
    readyStateRef.current = readyState;
  }, [sendJsonMessage, readyState]);

  const handleAudioPacket = useCallback((packet: AudioPacket) => {
    if (readyStateRef.current === ReadyState.OPEN) {
      sendJsonMessageRef.current(packet);
    }
  }, []);

  const {
    isRecording,
    packetsSent,
    supportedMimeType,
    error: audioError,
  } = useAudioStreaming({
    stream: mediaStream,
    onAudioPacket: handleAudioPacket,
    isActive: isCallActive && readyState === ReadyState.OPEN,
    timeSlice: 1000,
  });

  const handleStreamToggle = useCallback(
    (streaming: boolean) => {
      setIsCallActive(streaming);
      if (streaming) {
        connect(inputUrl);
      } else {
        disconnect(1000, 'Call ended');
      }
    },
    [inputUrl, connect, disconnect],
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
          <SimulationVideoArea
            onStreamToggle={handleStreamToggle}
            onStreamChange={setMediaStream}
          />
          <SimulationTranscriptionArea transcriptions={staticTranscriptions} />
        </div>

        <div className="space-y-6">
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
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Audio:</span>
              <span
                className={cn(
                  'font-medium',
                  isRecording ? 'text-green-600' : 'text-gray-600',
                )}
              >
                {isRecording ? 'Streaming' : 'Idle'}
              </span>
            </div>
            {isRecording && (
              <div className="text-xs text-gray-600">
                Packets sent: {packetsSent}
                {supportedMimeType && (
                  <span className="block text-gray-500">
                    Format: {supportedMimeType.split(';')[0]}
                  </span>
                )}
              </div>
            )}
            {audioError && (
              <div className="text-xs text-red-600 p-2 bg-red-50 rounded">
                <div className="font-semibold">Audio Error:</div>
                <div>{audioError}</div>
              </div>
            )}
            {wsError && (
              <div className="text-xs text-red-600 p-2 bg-red-50 rounded border border-red-200">
                <div className="font-semibold">WebSocket Error:</div>
                <div>{wsError}</div>
                {connectionAttempts > 0 && (
                  <div className="mt-1 text-gray-600">
                    Connection attempts: {connectionAttempts}
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 italic">
              Connection starts when call begins
            </p>
            <details className="text-xs text-gray-500 cursor-pointer">
              <summary className="font-medium">
                Alternative test servers
              </summary>
              <div className="mt-2 space-y-1 pl-2 cursor-default">
                <div className="font-mono">ws://localhost:8080</div>
                <div className="font-mono">wss://echo.websocket.org</div>
                <div className="font-mono">wss://ws.postman-echo.com/raw</div>
              </div>
            </details>
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
                    type: 'message',
                    payload: 'Hello JSON WebSocket!',
                  })
                }
                disabled={readyState !== ReadyState.OPEN}
                size="sm"
                variant="contained"
              >
                Send JSON Message
              </Button>
              <Button
                onClick={() => sendPing({ message: 'Ping from client' })}
                disabled={readyState !== ReadyState.OPEN}
                size="sm"
                variant="contained"
              >
                Send Ping
              </Button>
            </div>
          </div>

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
