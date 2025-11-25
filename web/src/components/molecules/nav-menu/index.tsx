import NavLink from '@/components/molecules/nav-link';
import { organizeNavigation } from '@/utils/navigation';
import { useRouterState } from '@tanstack/react-router';

import { NavMenuProps } from './types';

/**
 * Navigation menu component that renders navigation items from configuration
 *
 * Features:
 * - Automatic grouping and ordering of navigation items
 * - Support for nested menu items
 * - Active state tracking based on current route
 * - Optional group separators
 *
 * @component
 * @example
 * ```tsx
 * import { navigationConfig } from '@/config/navigation';
 *
 * <NavMenu
 *   items={navigationConfig}
 *   showGroupSeparators={true}
 * />
 * ```
 */
export const NavMenu = ({
  items,
  showGroupSeparators = true,
  className = '',
  isCollapsed = false,
}: NavMenuProps & { isCollapsed?: boolean }) => {
  const currentPath = useRouterState().location.pathname;

  const groups = organizeNavigation(items);

  return (
    <nav className={className}>
      {groups.map((group, groupIndex) => (
        <div key={group.name}>
          <ul className="space-y-2">
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  isActive={
                    currentPath === item.to ||
                    currentPath.startsWith(`${item.to}/`)
                  }
                  isCollapsed={isCollapsed}
                />
              </li>
            ))}
          </ul>

          {showGroupSeparators && groupIndex < groups.length - 1 && (
            <hr className="my-4 border-border" />
          )}
        </div>
      ))}
    </nav>
  );
};

export default NavMenu;
