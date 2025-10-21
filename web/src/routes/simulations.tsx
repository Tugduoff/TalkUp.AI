import SimulationArea from '@/components/molecules/simulation-area';
import { createAuthGuard } from '@/utils/auth.guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/simulations')({
  beforeLoad: createAuthGuard('/simulations'),
  component: Simulations,
});

/**
 * Simulations component.
 *
 * Renders the main simulation page, including the headers and the core
 * SimulationArea molecule, initialized in the 'pending' state.
 * * Note: This component serves as a container/page and is integrated
 * with TanStack Router.
 * * @returns {JSX.Element} The rendered Simulations page.
 */
function Simulations() {
  // Static props for initial display of the SimulationArea component
  const simulationProps = {
    status: 'pending' as const, // Sets the state to 'En attente'
    timer: '00:00',
  };

  return (
    <div className="p-2">
      {/* Existing Headers */}
      <h3 className="text-primary">Simulations</h3>
      <p>Simulations</p>

      {/* Integration of the SimulationArea component */}
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <SimulationArea {...simulationProps} />
      </div>
    </div>
  );
}
