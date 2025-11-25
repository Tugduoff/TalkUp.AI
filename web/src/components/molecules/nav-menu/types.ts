import { NavItem } from '@/types/navigation';

/**
 * Props for the NavMenu component
 */
export interface NavMenuProps {
  /** Navigation items to render */
  items: NavItem[];
  /** Whether to show group separators */
  showGroupSeparators?: boolean;
  /** Additional CSS classes */
  className?: string;
}
