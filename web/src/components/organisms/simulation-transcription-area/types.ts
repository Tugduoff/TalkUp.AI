/**
 * Defines the props for the TranscriptionBubble component.
 */
export interface TranscriptionBubbleProps {
  /**
   * Whether the speaker is the AI or the user.
   * Determines the color and alignment of the bubble.
   */
  isIA: boolean;
  /**
   * The name/label to display for the speaker (e.g., "AI Assistant", "John", "User").
   */
  speaker: string;
  /**
   * The text content of the spoken message.
   */
  text: string;
}
