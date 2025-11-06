import TranscriptionArea from '@/components/organisms/simulation-transcription-area';
import { TranscriptionBubbleProps } from '@/components/organisms/simulation-transcription-area/types';
import SimulationArea from '@/components/organisms/simulation-video-area';
import { createAuthGuard } from '@/utils/auth.guards';
import { createFileRoute } from '@tanstack/react-router';

import InfoBox from '../components/molecules/info-div';

export const Route = createFileRoute('/simulations')({
  beforeLoad: createAuthGuard('/simulations'),
  component: Simulations,
});

/**
 * Simulations Page Component
 * @returns The Simulations page component.
 */
function Simulations() {
  const staticTranscriptions: TranscriptionBubbleProps[] = [
    {
      isIA: true,
      speaker: 'AI',
      text: "Hello, thank you for joining me. Let's start the interview.",
    },
    {
      isIA: false,
      speaker: 'You',
      text: "Hello, I'm delighted to be here. I look forward to discussing how my experience can benefit your team.",
    },
    {
      isIA: true,
      speaker: 'AI',
      text: 'Excellent. Can you tell me about a recent project where you faced a particularly difficult technical challenge, and how you overcame it?',
    },
  ];

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Simulations</h1>
          <p className="text-gray-600">
            Simulations let you practice interview scenarios in a safe
            environment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_20rem] gap-6">
        <div>
          <SimulationArea />
          <TranscriptionArea transcriptions={staticTranscriptions} />
        </div>

        <div className="space-y-6">
          <InfoBox
            title="Statistics Overview"
            text="Real-time statistics will appear here."
            icon="notifications"
          />

          <InfoBox
            title="Real time advice"
            text="Remember to keep your hands above the table"
            icon="check"
          />

          <img src="/avatarworking.png" alt="Avatar Working" />
        </div>
      </div>
    </div>
  );
}
