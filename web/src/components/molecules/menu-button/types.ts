import { MenuItem } from '@/components/molecules/menu/types';

export interface MenuButtonProps {
  items: MenuItem[];
  trigger?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}
