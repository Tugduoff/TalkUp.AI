import { Button } from '@/components/atoms/button';
import { Icon } from '@/components/atoms/icon';
import { Menu } from '@/components/molecules/menu';
import { cn } from '@/utils/cn';
import React, { useEffect, useRef, useState } from 'react';

import { MenuButtonProps } from './types';

/**
 * `MenuButton` is a React component that renders a customizable menu button with a dropdown menu.
 * It supports different menu positions (`top`, `bottom`, `left`, `right`) and allows for a custom trigger element.
 * The menu closes automatically when clicking outside of it.
 *
 * @param items - An array of menu items to display in the dropdown.
 * @param trigger - Optional custom trigger element to open the menu. If not provided, a default icon button is used.
 * @param position - The position of the dropdown menu relative to the trigger (`top`, `bottom`, `left`, `right`). Defaults to `'bottom'`.
 * @param className - Optional additional CSS classes for the root element.
 * @param props - Additional props passed to the root div.
 * @param _ref - Ref forwarded to the root div element.
 *
 * @returns A menu button component with a dropdown menu.
 */
export const MenuButton = React.forwardRef<HTMLDivElement, MenuButtonProps>(
  ({ items, trigger, position = 'bottom', className, ...props }, _ref) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsMenuOpen(false);
        }
      };

      if (isMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isMenuOpen]);

    /**
     * Returns a string of CSS classes based on the provided `position` prop.
     * These classes are used to position a menu relative to its trigger element.
     *
     * @returns {string} CSS class names for positioning the menu.
     *
     * Positions supported:
     * - `'top'`: Positions the menu above the trigger.
     * - `'bottom'`: Positions the menu below the trigger.
     * - `'left'`: Positions the menu to the left of the trigger.
     * - `'right'`: Positions the menu to the right of the trigger.
     * - Any other value defaults to `'bottom'` positioning.
     */
    const getPositionClasses = () => {
      switch (position) {
        case 'top':
          return 'bottom-full mb-1';
        case 'bottom':
          return 'top-full mt-1';
        case 'left':
          return 'right-full mr-1';
        case 'right':
          return 'left-full ml-1';
        default:
          return 'top-full mt-1';
      }
    };

    const defaultTrigger = (
      <Button
        variant="text"
        size="sm"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-1 hover:bg-neutral-weaker rounded-md"
      >
        <Icon icon="more-vert" size="sm" color="neutral" />
      </Button>
    );

    const triggerElement = trigger ? (
      <Button
        variant="text"
        size="sm"
        type="button"
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="inline-flex p-0"
      >
        {trigger}
      </Button>
    ) : null;

    return (
      <div className={cn('relative', className)} ref={menuRef} {...props}>
        {triggerElement ?? defaultTrigger}

        {isMenuOpen && items.length > 0 && (
          <Menu
            items={items}
            onItemClick={() => setIsMenuOpen(false)}
            className={cn('absolute z-50', getPositionClasses())}
          />
        )}
      </div>
    );
  },
);

MenuButton.displayName = 'MenuButton';
