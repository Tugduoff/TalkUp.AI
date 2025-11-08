import { Icon } from '@/components/atoms/icon';
import VideoAreaControlsBar from '@/components/molecules/video-area-controls-bar';
import { cn } from '@/utils/cn';
import { formatDurationISO, formatTime } from '@/utils/time';
import { useEffect, useRef, useState } from 'react';

import { useAudioAnalyzer } from '../../../hooks/streams/useAudioAnalyzer';
import { useStreamControls } from '../../../hooks/streams/useStreamControls';
import { useVideoStream } from '../../../hooks/streams/useVideoStream';

interface SimulationVideoAreaProps {
  onStreamToggle?: (streaming: boolean) => void;
}

/**
 * SimulationVideoArea component.
 * @returns The SimulationVideoArea component.
 */
const SimulationVideoArea = ({
  onStreamToggle,
}: SimulationVideoAreaProps = {}): React.ReactElement => {
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const [shouldStartWithMic, setShouldStartWithMic] = useState(true);
  const [shouldStartWithCamera, setShouldStartWithCamera] = useState(true);

  const { videoRef, isStreaming, elapsedTime, toggleStream } = useVideoStream({
    shouldStartWithMic,
    shouldStartWithCamera,
  });

  const {
    isMicActive,
    isSpeakerActive,
    isCameraActive,
    toggleMic,
    toggleSpeaker,
    toggleCamera,
  } = useStreamControls(videoRef, audioElementRef, {
    onMicChange: setShouldStartWithMic,
    onCameraChange: setShouldStartWithCamera,
  });

  const stream =
    typeof MediaStream !== 'undefined' &&
    videoRef.current?.srcObject instanceof MediaStream
      ? (videoRef.current.srcObject as MediaStream)
      : null;

  const { isSpeaking } = useAudioAnalyzer(stream);

  // Notify parent component when stream state changes
  useEffect(() => {
    if (onStreamToggle) {
      onStreamToggle(isStreaming);
    }
  }, [isStreaming, onStreamToggle]);

  useEffect(() => {
    if (!audioElementRef.current || !videoRef.current) return;

    const audioElement = audioElementRef.current;

    if (isStreaming) {
      const src = videoRef.current.srcObject;
      if (typeof MediaStream !== 'undefined' && src instanceof MediaStream) {
        const stream = src as MediaStream;
        if (stream.getAudioTracks().length > 0) {
          audioElement.srcObject = stream;
          audioElement.muted = !isSpeakerActive;
          audioElement.play().catch((err) => {
            console.error('Error playing audio:', err);
          });
        }
      }
    } else {
      if (audioElement.srcObject) {
        audioElement.pause();
        audioElement.srcObject = null;
      }
    }
  }, [isStreaming, isSpeakerActive, videoRef]);

  return (
    <div className="relative w-full aspect-video bg-neutral rounded-lg overflow-hidden">
      {isStreaming && (
        <img
          src="/interviewer.jpg"
          alt="Interviewer"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div
        className={cn(
          'absolute top-4 right-4 w-1/4 aspect-video rounded-lg overflow-hidden ring-2 ring-white',
          isSpeaking ? 'ring-4 ring-blue-500' : '',
        )}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover transition-all bg-[#000]"
          muted
        />
        <div className="flex absolute top-2 right-2 space-x-2">
          {!isMicActive && (
            <div className="bg-error rounded-full p-1.5">
              <Icon icon="mic-off" size="sm" color="white" />
            </div>
          )}
          {!isSpeakerActive && (
            <div className="bg-error rounded-full p-1.5">
              <Icon icon="speaker-off" size="sm" color="white" />
            </div>
          )}
          {!isCameraActive && (
            <div className="bg-error rounded-full p-1.5">
              <Icon icon="video-off" size="sm" color="white" />
            </div>
          )}
        </div>
      </div>

      {isStreaming && (
        <time
          className="absolute top-4 left-4 text-white text-sm font-semibold bg-gray-800/50 px-3 py-1 rounded"
          dateTime={formatDurationISO(elapsedTime)}
        >
          {formatTime(elapsedTime)}
        </time>
      )}

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioElementRef} style={{ display: 'none' }} />

      <VideoAreaControlsBar
        toggleStream={toggleStream}
        isStreaming={isStreaming}
        isMicActive={isMicActive}
        isCameraActive={isCameraActive}
        isSpeakerActive={isSpeakerActive}
        toggleMic={toggleMic}
        toggleSpeaker={toggleSpeaker}
        toggleCamera={toggleCamera}
      />
    </div>
  );
};

export default SimulationVideoArea;
