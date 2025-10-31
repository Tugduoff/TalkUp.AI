import { TranscriptionBubbleProps } from './types';

/**
 * TranscriptionBubble component.
 *
 * Renders a single speech bubble within the transcription area. The appearance
 * and alignment of the bubble change based on the 'speaker' prop.
 *
 * @param {TranscriptionBubbleProps} props The properties object.
 * @param {Speaker} props.speaker The speaker of the message ('IA' or 'User').
 * @param {string} props.text The message text inside the bubble.
 * @returns {JSX.Element} The rendered transcription bubble.
 */
const TranscriptionBubble = ({ speaker, text }: TranscriptionBubbleProps) => {
  const isIA = speaker === 'IA';
  const bubbleClasses = isIA
    ? 'bg-primary-weak text-primary'
    : 'bg-neutral-weaker text-neutral';
  const alignmentClasses = isIA ? 'justify-start' : 'justify-end';

  return (
    <div className={`flex w-full ${alignmentClasses} mb-4`}>
      <div className={`max-w-3/4 p-3 rounded-xl ${bubbleClasses} shadow-sm`}>
        <span
          className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${isIA ? 'bg-primary text-white' : 'bg-neutral text-white'}`}
        >
          {speaker}
        </span>
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
};

export default TranscriptionBubble;
