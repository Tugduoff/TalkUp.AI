import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook to analyze audio from a MediaStream.
 * Detects speech and measures audio levels for visualization.
 *
 * @param {MediaStream | null} stream - The media stream to analyze
 * @returns {{
 *   isSpeaking: boolean,
 *   audioLevel: number
 * }}
 */
export const useAudioAnalyzer = (stream: MediaStream | null) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Analyzes audio input to detect speech and measure audio levels
   */
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);

      // Calculate average volume
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const normalizedLevel = Math.min(100, (average / 255) * 100);

      setAudioLevel(normalizedLevel);

      // Detect speaking (threshold of 5%)
      const speakingThreshold = 5;
      setIsSpeaking(normalizedLevel > speakingThreshold);

      animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
    };

    checkAudioLevel();
  }, []);

  /**
   * Sets up audio analysis for the provided stream
   */
  useEffect(() => {
    if (!stream) {
      // Clean up if no stream
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      setIsSpeaking(false);
      setAudioLevel(0);
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      return;
    }

    try {
      // Setup audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Start analyzing
      analyzeAudio();
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }

    // Cleanup on stream change or unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      setIsSpeaking(false);
      setAudioLevel(0);
    };
  }, [stream, analyzeAudio]);

  return {
    isSpeaking,
    audioLevel,
  };
};
