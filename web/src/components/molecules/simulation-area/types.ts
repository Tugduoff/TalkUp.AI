/**
 * Defines the props for the SimulationArea component.
 */
export interface SimulationAreaProps {
  /**
   * The current status of the simulation.
   * 'pending': Shows the "En attente" overlay.
   * 'active': Simulation is running.
   * 'finished': Simulation has ended.
   */
  status: 'active' | 'pending' | 'finished';
  /**
   * The time elapsed in the simulation, formatted as a string (e.g., "00:00").
   */
  timer: string;
}
