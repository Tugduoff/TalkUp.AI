import { IconName } from '@/components/atoms/icon/icon-map';

/**
 * Defines the props for the InfoBox component.
 */
export interface InfoBoxProps {
  /**
   * The title of the tip panel (e.g., "Real-time Advice").
   */
  title: string;
  /**
   * The actual text content of the advice provided by the AI (e.g., "Maintain eye contact! Try varying your intonation...").
   */
  text: string;
  /**
   * The icon to display alongside the title.
   */
  icon: IconName;
}
