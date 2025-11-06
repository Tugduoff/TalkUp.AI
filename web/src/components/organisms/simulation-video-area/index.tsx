import { formatDurationISO, formatTime } from '@/utils/time';
import ControlsBar from './controls-bar';

import { useVideoStream } from '../../../hooks/streams/useVideoStream';

/**
 * SimulationArea component.
 * @returns The SimulationArea component.
 */
const SimulationArea = (): React.ReactElement => {
  const { videoRef, isStreaming, elapsedTime, toggleStream } = useVideoStream();

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
      />

      {isStreaming && (
        <time
          className="absolute top-4 left-4 text-white text-sm font-semibold bg-gray-800/50 px-3 py-1 rounded"
          dateTime={formatDurationISO(elapsedTime)}
        >
          {formatTime(elapsedTime)}
        </time>
      )}

      <ControlsBar toggleStream={toggleStream} isStreaming={isStreaming} />
    </div>
  );
};

export default SimulationArea;
