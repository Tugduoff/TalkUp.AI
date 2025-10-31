import InCallIcon from '@/assets/incall.png';
import SpeakerIcon from '@/assets/speaker.png';
import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { formatTime } from '@/utils/time';
import { useEffect, useRef, useState } from 'react';

import { SimulationAreaProps } from './types';

/**
 * Renders the video call simulation area.
 *
 * It manages:
 * - Conditional access to the user's camera stream (only when `isStarted` is true).
 * - Tracking elapsed time with a timer (only when started and active).
 * - Displaying status overlays (Waiting/Pending).
 * - Call controls and the end call functionality.
 *
 * @param {SimulationAreaProps} props - The component properties, including status and start flag.
 * @returns {JSX.Element} The Simulation Area component.
 */
const SimulationArea = ({ status, isStarted }: SimulationAreaProps) => {
  const isPending = status === 'pending';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  /**
   * Helper function to safely stop the video stream.
   * Uses TypeScript type guards to ensure the ref and srcObject exist.
   */
  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  /**
   * Effect conditionnel: Starts the camera stream only when `isStarted` is true.
   * Cleans up the stream on unmount or when the simulation ends.
   */
  useEffect(() => {
    if (!isStarted) {
      stopVideoStream();
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    startCamera();

    return () => {
      stopVideoStream();
    };
  }, [isStarted]);

  /**
   * Effect to manage the call timer. The interval runs only if the simulation is started and active.
   */
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isStarted && !isCallEnded) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallEnded, isStarted]);

  /**
   * Handles the action of ending the call. Stops the video stream and updates the state.
   * Also resets the elapsed time, as per the review comment.
   */
  const handleEndCall = () => {
    stopVideoStream();
    setIsCallEnded(true);
    setElapsedTime(0);
  }; // <-- MISSING BRACE ADDED HERE TO CLOSE handleEndCall

  /* The original formatTime function has been removed from here. */

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

      {/* Pending status overlay / Initial waiting screen */}
      {showWaitingOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="text-white text-lg font-medium border border-white/50 px-4 py-2 rounded-full">
            {isStarted ? 'En attente' : "Cliquez sur 'Démarrer l'entretien'"}
          </span>
        </div>
      )}

      {/* Control buttons - Only show controls when the simulation has started */}
      {isStarted && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-6">
          {/* Speaker Button */}
          <Button
            size="md"
            variant="text"
            className="rounded-full h-12 w-12 bg-gray-700 hover:bg-gray-600"
          >
            <img src={SpeakerIcon} alt="Speaker" className="w-6 h-6 invert" />
          </Button>

          {/* Hang-up Button */}
          <Button
            size="md"
            onClick={handleEndCall}
            className={`rounded-full h-14 w-14 ${
              isCallEnded
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <img
              src={InCallIcon}
              alt="End Call"
              className="w-7 h-7 invert rotate-135"
            />
          </Button>

          {/* Microphone Button */}
          <Button
            size="md"
            variant="text"
            className="rounded-full h-12 w-12 bg-gray-700 hover:bg-gray-600"
          >
            <Icon icon="user" size="lg" color="neutral" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimulationArea;
