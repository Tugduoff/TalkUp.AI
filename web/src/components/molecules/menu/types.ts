import { IconName } from '@/components/atoms/icon/icon-map';

export type MenuItemVariant = 'default' | 'danger';
export type MenuItemSize = 'sm' | 'md';

export interface MenuItemButton {
  type: 'button';
  label: string;
  onClick: () => void;
  icon?: IconName;
  variant?: MenuItemVariant;
  size?: MenuItemSize;
  disabled?: boolean;
}

export interface MenuItemText {
  type: 'text';
  label: string;
  variant?: 'default' | 'muted';
}

export interface MenuItemSpacer {
  type: 'spacer';
}

export interface MenuItemDivider {
  type: 'divider';
}

export type MenuItem =
  | MenuItemButton
  | MenuItemText
  | MenuItemSpacer
  | MenuItemDivider;

export interface MenuProps {
  items: MenuItem[];
  className?: string;
  onItemClick?: () => void;
}
