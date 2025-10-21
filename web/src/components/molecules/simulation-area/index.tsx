import InCallIcon from '@/assets/incall.png';
import SpeakerIcon from '@/assets/speaker.png';
import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';

import { SimulationAreaProps } from './types';

/**
 * SimulationArea component.
 *
 * Renders the main interactive area for the interview simulation,
 * featuring a video placeholder, a timer, a status indicator ("En attente"),
 * and control buttons for speaker, ending the call, and microphone.
 *
 * Implementation Note: To resolve TypeScript errors, 'size' is set to 'md'
 * and 'variant' is set to 'text' (a commonly available neutral variant)
 * while the actual styling (circular shape, custom colors, and dimensions)
 * is entirely controlled by the Tailwind CSS classes in the 'className' prop.
 *
 * @param {SimulationAreaProps} props The properties object.
 * @param {('active' | 'pending' | 'finished')} props.status The current state of the simulation.
 * @param {string} props.timer The time elapsed (e.g., "00:00").
 * @returns {JSX.Element} The rendered simulation area component.
 */
const SimulationArea = ({ status, timer }: SimulationAreaProps) => {
  const isPending = status === 'pending';

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
      {/* Timer */}
      <div className="absolute top-4 left-4 text-white text-sm font-semibold bg-gray-800/50 px-3 py-1 rounded">
        {timer}
      </div>

      {/* Pending status overlay */}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="text-white text-lg font-medium border border-white/50 px-4 py-2 rounded-full">
            En attente
          </span>
        </div>
      )}

      {/* Control buttons */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-6">
        {/* Speaker Button (uses speaker.png) */}
        <Button
          size="md"
          variant="text"
          className="rounded-full h-12 w-12 bg-gray-700 hover:bg-gray-600"
        >
          <img src={SpeakerIcon} alt="Speaker" className="w-6 h-6 invert" />
        </Button>

        {/* Hang-up Button (uses incall.png) */}
        <Button
          size="md"
          color="red"
          className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700"
        >
          <img
            src={InCallIcon}
            alt="End Call"
            className="w-7 h-7 invert rotate-135"
          />
        </Button>

        {/* Microphone Button (uses generic mic icon) */}
        <Button
          size="md"
          variant="text"
          className="rounded-full h-12 w-12 bg-gray-700 hover:bg-gray-600"
        >
          <Icon icon="user" size="lg" color="neutral" />
        </Button>
      </div>
    </div>
  );
};

export default SimulationArea;
