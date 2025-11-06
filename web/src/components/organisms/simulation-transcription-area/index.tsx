import { TranscriptionBubbleProps } from './types';

interface TranscriptionAreaProps {
  transcriptions: TranscriptionBubbleProps[];
}

const TranscriptionArea = ({ transcriptions }: TranscriptionAreaProps) => {
  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Transcriptions</h2>
      <div className="max-h-96 overflow-y-auto">
        {transcriptions.map((t, index) => {
          const alignment = t.isIA ? 'justify-start' : 'justify-end';
          const bubbleColor = t.isIA
            ? 'bg-primary-weak text-primary'
            : 'bg-neutral-weaker text-neutral';

          return (
            <div key={index} className={`flex w-full ${alignment} mb-4`}>
              <div
                className={`p-3 rounded-xl shadow-sm max-w-3/4 ${bubbleColor}`}
              >
                <p className="text-sm">
                  <span className="font-semibold bg-accent/80 text-white px-2 py-0.5 rounded-full mr-2">
                    {t.speaker}
                  </span>
                  {t.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TranscriptionArea;
