/**
 * Defines the possible speakers in the transcription.
 */
export type Speaker = 'IA' | 'User';

/**
 * Defines the props for the TranscriptionBubble component.
 */
export interface TranscriptionBubbleProps {
  /**
   * The speaker of the message ('IA' or 'User').
   * Determines the color and alignment of the bubble.
   */
  speaker: Speaker;
  /**
   * The text content of the spoken message.
   */
  text: string;
}
