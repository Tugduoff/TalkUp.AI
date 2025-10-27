import { Button } from '@/components/atoms/button';
import { InputMolecule } from '@/components/molecules/input-molecule';
import { createAuthGuard } from '@/utils/auth.guards';
import { cn } from '@/utils/cn';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const Route = createFileRoute('/simulations')({
  beforeLoad: createAuthGuard('/simulations'),
  component: Simulations,
});

function Simulations() {
  const [socketUrl, setSocketUrl] = useState('wss://echo.websocket.org');
  const [inputUrl, setInputUrl] = useState('wss://echo.websocket.org');

  const getSocketUrl = useCallback(() => {
    // Async call to a backend to retrieve AI Webhook URL
    return socketUrl;
  }, [socketUrl]);

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(getSocketUrl, {
    onOpen: () => console.log('opened'),
    shouldReconnect: (_closeEvent) => true,
  });

  const handleConfirmUrl = () => {
    setSocketUrl(inputUrl);
  };

  const readyStateRecord: Record<ReadyState, { label: string; color: string }> = {
    [ReadyState.CONNECTING]: { label: 'Connecting', color: 'text-yellow-600' },
    [ReadyState.OPEN]: { label: 'Connected', color: 'text-green-600' },
    [ReadyState.CLOSING]: { label: 'Closing', color: 'text-red-600' },
    [ReadyState.CLOSED]: { label: 'Closed', color: 'text-red-600' },
    [ReadyState.UNINSTANTIATED]: { label: 'Uninstantiated', color: 'text-gray-600' },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary mb-6">WebSocket Simulations</h1>

      {/* WebSocket URL Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Connection Settings</h2>
        <div className="flex flex-col">
          <div className="flex-1">
            <InputMolecule
              label="Socket URL"
              type="base"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
          </div>
          <Button
            onClick={handleConfirmUrl}
            className="mb-1"
            variant="contained"
            disabled={!inputUrl || inputUrl === socketUrl}
          >
            Connect
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Status:</span>
          <span className={cn('font-medium', readyStateRecord[readyState].color)}>
            {readyStateRecord[readyState].label}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => sendMessage('Hello WebSocket!')}
            disabled={readyState !== ReadyState.OPEN}
          >
            Send Message
          </Button>
          <Button
            onClick={() => sendJsonMessage({ type: 'greet', payload: 'Hello JSON WebSocket!' })}
            disabled={readyState !== ReadyState.OPEN}
          >
            Send JSON Message
          </Button>
          <Button
            onClick={() => getWebSocket()?.close()}
            disabled={readyState !== ReadyState.OPEN}
          >
            Close WebSocket
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
        {lastMessage && (
          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Last Message:</p>
            <p className="text-sm text-gray-800 break-all">{lastMessage.data}</p>
          </div>
        )}
        {lastJsonMessage ? (
          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Last JSON Message:</p>
            <pre className="text-sm text-gray-800 overflow-x-auto">
              {JSON.stringify(lastJsonMessage as any, null, 2) ?? ''}
            </pre>
          </div>
        ) : null}
        {!lastMessage && !lastJsonMessage && (
          <p className="text-sm text-gray-500 italic">No messages received yet</p>
        )}
      </div>
    </div>
  );
}
