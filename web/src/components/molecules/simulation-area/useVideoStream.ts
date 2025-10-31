import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to manage video call stream logic.
 *
 * Handles:
 * - Camera stream initialization and cleanup.
 * - Call state (ended or active).
 * - Elapsed time tracking.
 * - Pending status detection.
 *
 * @param {boolean} isStarted - Indicates whether the call simulation has started.
 * @param {string} status - The current call status ("pending", "active", etc.).
 * @param {function(string): void} setStatus - Function to update the overall call status (ADDED for review comment).
 * @returns {{
 * videoRef: React.RefObject<HTMLVideoElement>,
 * isPending: boolean,
 * isCallEnded: boolean,
 * elapsedTime: number,
 * handleEndCall: () => void
 * }} The video stream utilities and state.
 */
export const useVideoStream = (
  isStarted: boolean,
  status: string,
  setStatus: (s: string) => void, // NOUVEAU PARAMÈTRE
) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [isRestarting, setIsRestarting] = useState(false);

  const isPending = status === 'pending';

  /**
   * Safely stops the video stream.
   * Ensures all tracks are properly stopped and cleared from the video element.
   */
  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  /**
   * Ends the call (if active) OR restarts the call (if ended).
   */
  const handleEndCall = () => {
    if (isCallEnded) {
      setIsCallEnded(false);
      setIsRestarting((prev) => !prev);
    } else {
      stopVideoStream();
      setIsCallEnded(true);
      setElapsedTime(0);
      setStatus('finished');
    }
  };

  /**
   * Effect: Starts or stops the camera stream based on `isStarted` OU `isRestarting`.
   * J'ajoute `isRestarting` aux dépendances pour forcer le redémarrage.
   */
  useEffect(() => {
    if (!isStarted && !isRestarting) {
      stopVideoStream();
      return;
    }

    if (isStarted || isRestarting) {
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
    }

    return () => {
      stopVideoStream();
    };
  }, [isStarted, isRestarting]);

  /**
   * Effect: Manages the elapsed time counter.
   */
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isStarted && !isCallEnded) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStarted, isCallEnded]);

  return {
    videoRef,
    isPending,
    isCallEnded,
    elapsedTime,
    handleEndCall,
  };
};
