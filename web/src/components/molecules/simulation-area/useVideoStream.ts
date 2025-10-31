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
 * @returns {{
 *  videoRef: React.RefObject<HTMLVideoElement>,
 *  isPending: boolean,
 *  isCallEnded: boolean,
 *  elapsedTime: number,
 *  handleEndCall: () => void
 * }} The video stream utilities and state.
 */
export const useVideoStream = (isStarted: boolean, status: string) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

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
   * Ends the call and resets relevant state values.
   */
  const handleEndCall = () => {
    stopVideoStream();
    setIsCallEnded(true);
    setElapsedTime(0);
  };

  /**
   * Effect: Starts or stops the camera stream based on `isStarted`.
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
   * Effect: Manages the elapsed time counter.
   * Runs every second while the call is active and not ended.
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
