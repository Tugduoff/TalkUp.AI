import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import RealTimeTip from '@/components/molecules/real-time-tip';
import SimulationArea from '@/components/molecules/simulation-area';
import TranscriptionArea from '@/components/molecules/transcription-area';
import { TranscriptionBubbleProps } from '@/components/molecules/transcription-area/types';
import { useState } from 'react';

/**
 * Defines the props for the SimulationPageContent component.
 */
interface SimulationPageContentProps {
  /**
   * The main title of the page (e.g., "Simulations d'entretien").
   */
  pageTitle: string;
  /**
   * The subtitle or descriptive text for the page.
   */
  pageSubtitle: string;
  /**
   * The current time displayed on the simulation timer (e.g., "01:30").
   */
  simulationTimer: string;
  /**
   * The current status of the simulation ('active' | 'pending' | 'finished').
   */
  simulationStatus: 'active' | 'pending' | 'finished';
  /**
   * Array of transcription bubbles to display in the transcription area.
   */
  transcriptions: TranscriptionBubbleProps[];
  /**
   * The title for the real-time tip panel.
   */
  tipTitle: string;
  /**
   * The text content of the current real-time tip.
   */
  tipText: string;
  /**
   * Callback function executed when the "Start Simulation" button is clicked.
   * NOTE: We now control the state internally, but keep the prop for external logic.
   */
  onStartSimulation: () => void;
}

/**
 * SimulationPageContent component.
 *
 * This organism serves as the main layout container for the entire simulation page.
 * It combines the video area, transcription log, statistics placeholder, and real-time tips.
 *
 * @param {SimulationPageContentProps} props The properties object.
 * @returns {JSX.Element} The rendered simulation page content.
 */
const SimulationPageContent = ({
  pageTitle,
  pageSubtitle,
  simulationTimer,
  simulationStatus,
  transcriptions,
  tipTitle,
  tipText,
  onStartSimulation,
}: SimulationPageContentProps) => {
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);

  const handleStartSimulation = () => {
    setIsSimulationStarted(true);
    onStartSimulation();
  };

  const currentSimulationStatus = isSimulationStarted
    ? simulationStatus
    : 'pending';

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-gray-600">{pageSubtitle}</p>
        </div>
        <Button
          color="success"
          onClick={handleStartSimulation}
          disabled={isSimulationStarted}
        >
          {isSimulationStarted ? 'In progress...' : 'Start the interview'}
        </Button>
      </div>

      {/* Main Content: Video and Side Panels */}
      <div className="flex space-x-6">
        {/* Left Column: Video and Transcriptions */}
        <div className="flex-1 min-w-0">
          <SimulationArea
            status={currentSimulationStatus}
            timer={simulationTimer}
            isStarted={isSimulationStarted}
          />
          {/* Note: TranscriptionBubble expects a list of transcriptions */}
          <TranscriptionArea transcriptions={transcriptions} />
        </div>

        {/* Right Column: Statistics and Tips */}
        <div className="w-80 space-y-6 flex-shrink-0">
          {/* Statistics (Placeholder simple) */}
          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              {/* Using a valid icon name for statistics */}
              <Icon icon="chat" size="lg" color="accent" className="mr-2" />
              Statistiques
            </h3>
            <p className="text-sm text-gray-500">
              Real-time statistics will appear here.
            </p>
          </div>

          <RealTimeTip title={tipTitle} tipText={tipText} />
        </div>
      </div>
    </div>
  );
};
console.log('SimulationPageContent:', SimulationPageContent);
export default SimulationPageContent;
