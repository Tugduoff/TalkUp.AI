import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { formatTime } from '@/utils/time';
import { useState } from 'react';

import { SimulationAreaProps } from './types';
import { useVideoStream } from './useVideoStream';

/**
 * Renders the video call simulation area.
 *
 * This component displays:
 * - The user's camera stream when active.
 * - A timer showing the call duration.
 * - Control buttons (speaker, hang-up, microphone).
 * - Overlays for waiting or pending states.
 *
 * All video stream logic is handled by the `useVideoStream` hook.
 *
 * @component
 * @param {SimulationAreaProps} props - The component properties, including call status and start flag.
 * @returns {JSX.Element} The rendered Simulation Area.
 */
const SimulationArea = ({
  status,
  isStarted,
}: SimulationAreaProps): React.ReactElement => {
  const { videoRef, isPending, isCallEnded, elapsedTime, handleEndCall } =
    useVideoStream(isStarted, status);

  const [isSpeakerActive, setIsSpeakerActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);

  /** Toggles the speaker state between active and muted. */
  const toggleSpeaker = (): void => {
    setIsSpeakerActive((prev) => !prev);
  };

  /** Toggles the microphone state between active and muted. */
  const toggleMic = (): void => {
    setIsMicActive((prev) => !prev);
  };

  const showWaitingOverlay = !isStarted || isPending;

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
      {/* Video feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
      />

      {/* Timer */}
      {isStarted && !isCallEnded && (
        <div className="absolute top-4 left-4 text-white text-sm font-semibold bg-gray-800/50 px-3 py-1 rounded">
          {formatTime(elapsedTime)}
        </div>
      )}

      {/* Waiting or Pending overlay */}
      {showWaitingOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="text-white text-lg font-medium border border-white/50 px-4 py-2 rounded-full">
            {isStarted ? 'Waiting...' : "Click 'Start Interview' to begin"}
          </span>
        </div>
      )}

      {/* Control buttons */}
      {isStarted && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-6">
          {/* Speaker Button */}
          <Button
            size="md"
            onClick={toggleSpeaker}
            variant="text"
            className={`rounded-full h-12 w-12 ${
              isSpeakerActive
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <Icon
              icon={isSpeakerActive ? 'speaker' : 'speaker-off'}
              size="lg"
              color="neutral"
            />
          </Button>

          {/* Hang-up/Start Call Button (CORRIGÉ : Icône) */}
          <Button
            size="md"
            onClick={handleEndCall}
            className={`rounded-full h-14 w-14 ${
              isCallEnded
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <Icon
              icon={isCallEnded ? 'video' : 'hang-up'}
              size="xl"
              color="neutral"
            />
          </Button>

          {/* Microphone Button */}
          <Button
            size="md"
            onClick={toggleMic}
            variant="text"
            className={`rounded-full h-12 w-12 ${
              isMicActive
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <Icon
              icon={isMicActive ? 'mic-on' : 'mic-off'}
              size="lg"
              color="neutral"
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimulationArea;
