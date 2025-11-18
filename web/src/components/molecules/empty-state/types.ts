/**
 * @interface EmptyStateProps
 * @property {'notes' | 'search' | 'trash'} [icon] - Optional icon to display above the title; accepts 'notes', 'search', or 'trash'.
 * @property {string} title - Required main heading text shown in the empty state.
 * @property {string} description - Required descriptive text that explains the empty state or guides the user.
 * @property {string} [actionLabel] - Optional label for a primary action (e.g., "Create", "Retry"); if present, it indicates an actionable affordance.
 * @property {() => void} [onAction] - Optional callback invoked when the action is triggered; typically provided when actionLabel is supplied.
 */
export interface EmptyStateProps {
  icon?: 'notes' | 'search' | 'trash';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
