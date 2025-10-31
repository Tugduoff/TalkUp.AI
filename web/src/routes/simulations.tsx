import { TranscriptionBubbleProps } from '@/components/molecules/transcription-area/types';
import SimulationPageContent from '@/components/organisms/simulation-page-content';
import { createAuthGuard } from '@/utils/auth.guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/simulations')({
  beforeLoad: createAuthGuard('/simulations'),
  component: Simulations,
});

/**
 * Simulations component (Page Route component).
 *
 * This component acts as a data provider and container for the SimulationPageContent organism.
 * It is responsible for fetching (or providing static) data related to the interview
 * and passing it down to the main page layout component.
 *
 * @returns {JSX.Element} The rendered Simulation page with the complete layout.
 */
function Simulations() {
  const staticTranscriptions: TranscriptionBubbleProps[] = [
    {
      speaker: 'IA',
      text: "Hello, thank you for joining me. Let's start the interview.",
    },
    {
      speaker: 'User',
      text: "Hello, I'm delighted to be here. I look forward to discussing how my experience can benefit your team.",
    },
    {
      speaker: 'IA',
      text: 'Excellent. Can you tell me about a recent project where you faced a particularly difficult technical challenge, and how you overcame it?',
    },
  ];

  const simulationData = {
    pageTitle: 'Simulations',

    pageSubtitle:
      'Simulations let you practice interview scenarios in a safe environment.',

    simulationTimer: '03:45',
    simulationStatus: 'active' as const,

    tipTitle: 'Real-time Advice',
    tipText:
      'Your response is solid, but remember to integrate concrete metrics (KPIs) to quantify the impact of your technical solutions. Think STAR format.',

    transcriptions: staticTranscriptions,

    onStartSimulation: () =>
      console.log('Simulation started! (Function to be implemented)'),
  };

  return <SimulationPageContent {...simulationData} />;
}
