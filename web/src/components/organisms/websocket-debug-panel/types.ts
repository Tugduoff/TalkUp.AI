import { ReadyState } from 'react-use-websocket';

export interface WebSocketDebugPanelProps {
  // WebSocket connection state
  inputUrl: string;
  onInputUrlChange: (url: string) => void;
  readyState: ReadyState;
  isCallActive: boolean;

  // WebSocket methods
  sendMessage: (message: string) => void;
  sendJsonMessage: (message: object) => void;
  sendPing: (payload?: object) => void;

  // WebSocket messages
  lastMessage: MessageEvent | null;
  lastJsonMessage: unknown;

  // Audio streaming state
  isRecording: boolean;
  packetsSent: number;
  supportedMimeType: string | null;
  audioError: string | null;

  // WebSocket errors
  wsError: string | null;
  connectionAttempts: number;
}
