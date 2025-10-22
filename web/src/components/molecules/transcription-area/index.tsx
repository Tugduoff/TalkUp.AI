import TranscriptionBubble from './transcriptionBubble';
import { TranscriptionBubbleProps } from './types';

/**
 * Defines the props for the TranscriptionArea component.
 */
interface TranscriptionAreaProps {
  /**
   * The array of individual messages (bubbles) to be rendered.
   */
  transcriptions: TranscriptionBubbleProps[];
}

/**
 * TranscriptionArea component.
 *
 * This container component renders the chronological log of the conversation.
 * It iterates over the 'transcriptions' array to render multiple TranscriptionBubble components
 * in a scrollable area.
 *
 * @param {TranscriptionAreaProps} props The properties object.
 * @param {TranscriptionBubbleProps[]} props.transcriptions The array of messages to display.
 * @returns {JSX.Element} The rendered transcription area.
 */
const TranscriptionArea = ({ transcriptions }: TranscriptionAreaProps) => {
  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Transcriptions</h2>
      <div className="max-h-96 overflow-y-auto">
        {transcriptions.map((t, index) => (
          <TranscriptionBubble key={index} speaker={t.speaker} text={t.text} />
        ))}
      </div>
    </div>
  );
};

export default TranscriptionArea;
