import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { cn } from '@/utils/cn';
import React from 'react';

import { MenuItem, MenuItemButton, MenuProps } from './types';

/**
 * Generates the props for a button based on the provided menu item configuration.
 *
 * @param item - The menu item button configuration object.
 * @returns An object containing the button props, including variant, size, and color.
 *          If the item's variant is 'danger', the color will be set to 'error';
 *          otherwise, it defaults to 'neutral'.
 */
const getButtonProps = (item: MenuItemButton) => {
  const baseProps = {
    variant: 'text' as const,
    size: item.size || ('sm' as const),
  };

  if (item.variant === 'danger') {
    return {
      ...baseProps,
      color: 'error' as const,
    };
  }

  return {
    ...baseProps,
    color: 'neutral' as const,
  };
};

/**
 * Returns the color name for an icon based on the provided variant.
 *
 * @param variant - The variant of the icon, either `'default'` or `'danger'`.
 * @returns `'error'` if the variant is `'danger'`, otherwise `'neutral'`.
 */
const getIconColor = (variant?: 'default' | 'danger') => {
  return variant === 'danger' ? ('error' as const) : ('neutral' as const);
};


/**
 * `Menu` is a React forwardRef component that renders a customizable menu with various item types.
 * 
 * @param items - An array of menu items to display. Each item can be of type 'button', 'text', 'spacer', or 'divider'.
 * @param className - Optional additional CSS classes to apply to the menu container.
 * @param onItemClick - Optional callback invoked when any menu item of type 'button' is clicked.
 * @param props - Additional props passed to the root div element.
 * @param ref - Ref forwarded to the root div element.
 * 
 * @returns A styled menu component with support for buttons (with icons), text, spacers, and dividers.
 */
export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ items, className, onItemClick, ...props }, ref) => {
    const renderMenuItem = (item: MenuItem, index: number) => {
      switch (item.type) {
        case 'button': {
          const buttonProps = getButtonProps(item);
          return (
            <Button
              key={`button-${index}`}
              {...buttonProps}
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                onItemClick?.();
              }}
              className="w-full justify-start rounded-md font-medium"
            >
              {item.icon && (
                <Icon
                  icon={item.icon}
                  size="sm"
                  color={getIconColor(item.variant)}
                  className="mr-3"
                />
              )}
              {item.label}
            </Button>
          );
        }

        case 'text': {
          const textColorClass =
            item.variant === 'muted' ? 'text-gray-500' : 'text-gray-800';

          return (
            <div
              key={`text-${index}`}
              className={cn('px-3 py-2 text-sm font-medium', textColorClass)}
            >
              {item.label}
            </div>
          );
        }

        case 'spacer':
          return <div key={`spacer-${index}`} className="h-3" />;

        case 'divider':
          return (
            <hr
              key={`divider-${index}`}
              className="my-1 mx-0 border-t border-gray-200"
            />
          );

        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white border border-gray-200 rounded-xl p-1 flex flex-col ring-1 ring-black/5 gap-1',
          className,
        )}
        {...props}
      >
        {items.map(renderMenuItem)}
      </div>
    );
  },
);

Menu.displayName = 'Menu';
