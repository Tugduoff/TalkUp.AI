import { cn } from '@/utils/cn';
import React from 'react';

import { iconMap } from './icon-map';
import { IconProps } from './types';
import { iconVariants } from './variants';

/**
 * A customizable icon component that renders react-icons with consistent styling.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string | React.ComponentType} props.icon - The icon name (string) or react-icons component to render
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} [props.size='md'] - The size of the icon
 * @param {'primary' | 'accent' | 'black' | 'white' | 'success' | 'warning' | 'neutral' | 'error' | 'inherit'} [props.color='inherit'] - The color of the icon
 * @param {string} [props.className] - Additional CSS classes
 *
 * @returns {JSX.Element} The icon component
 *
 * @example
 * // Using icon name
 * <Icon icon="user" size="lg" color="primary" />
 *
 * @example
 * // Using direct component
 * import { FaUser } from 'react-icons/fa';
 * <Icon icon={FaUser} size="sm" color="neutral" />
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon, size, color, className, ...props }, ref) => {
    const IconComponent =
      typeof icon === 'string' ? iconMap[icon as keyof typeof iconMap] : icon;

    if (!IconComponent) {
      console.warn(`Icon "${icon}" not found in icon map`);
      return null;
    }

    return (
      <IconComponent
        ref={ref}
        className={cn(iconVariants({ size, color }), className)}
        {...props}
      />
    );
  },
);

Icon.displayName = 'Icon';
