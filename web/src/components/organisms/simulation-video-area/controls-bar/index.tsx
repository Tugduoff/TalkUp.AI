import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { useState } from 'react';

/**
 * Controls Bar Component
 * @returns {React.ReactElement} The Controls Bar component.
 */
function ControlsBar({
  toggleStream,
  isStreaming,
}: {
  toggleStream: () => void;
  isStreaming: boolean;
}): React.ReactElement {
  const [isSpeakerActive, setIsSpeakerActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);

  const toggleSpeaker = (): void => {
    setIsSpeakerActive((prev) => !prev);
  };

  const toggleMic = (): void => {
    setIsMicActive((prev) => !prev);
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-6">
      <Button
        size="md"
        onClick={toggleSpeaker}
        variant="text"
        className={`rounded-full h-12 w-12 ${
          isSpeakerActive
            ? 'bg-neutral hover:bg-neutral-hover'
            : 'bg-error hover:bg-error-hover'
        }`}
        aria-label={isSpeakerActive ? 'Mute speaker' : 'Unmute speaker'}
      >
        <Icon
          icon={isSpeakerActive ? 'speaker' : 'speaker-off'}
          size="lg"
          color="white"
        />
      </Button>

      <Button
        size="md"
        onClick={toggleStream}
        className={`rounded-full h-14 w-14 ${
          !isStreaming
            ? 'bg-success hover:bg-success-hover'
            : 'bg-error hover:bg-error-hover'
        }`}
        aria-label={!isStreaming ? 'Start new call' : 'End call'}
      >
        <Icon
          icon={!isStreaming ? 'video' : 'hang-up'}
          size="xl"
          color="white"
        />
      </Button>

      <Button
        size="md"
        onClick={toggleMic}
        variant="text"
        className={`rounded-full h-12 w-12 ${
          isMicActive
            ? 'bg-neutral hover:bg-neutral-hover'
            : 'bg-error hover:bg-error-hover'
        }`}
        aria-label={isMicActive ? 'Mute microphone' : 'Unmute microphone'}
      >
        <Icon
          icon={isMicActive ? 'mic-on' : 'mic-off'}
          size="lg"
          color="white"
        />
      </Button>
    </div>
  );
}

export default ControlsBar;
