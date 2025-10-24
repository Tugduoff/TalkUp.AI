export interface SimulationAreaProps {
  /**
   * The current status of the simulation.
   * 'pending': Shows the "En attente" overlay.
   * 'active': Simulation is running.
   * 'finished': Simulation has ended.
   */
  status: 'active' | 'pending' | 'finished';
  /**
   * Flag indicating whether the user has clicked "Start" to begin the simulation.
   * Controls the conditional activation of the camera and timer.
   */
  isStarted: boolean;
  /**
   * The current time displayed on the simulation timer (e.g., "01:30").
   * This property must be added to resolve TS2322.
   */
  timer: string;
}
