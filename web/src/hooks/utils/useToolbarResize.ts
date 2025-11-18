import { useEffect, useRef, useState } from 'react';

/**
 * Hook for managing toolbar responsive behavior and overflow menu.
 *
 * Handles:
 * - Measuring and caching group widths
 * - Determining which groups to hide based on available space
 * - Managing More menu open/close state
 * - Click-outside detection for dropdown
 *
 * @returns Refs, state, and helper functions for toolbar layout management
 */
export const useToolbarResize = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [hiddenGroups, setHiddenGroups] = useState<string[]>([]);
  const [moreOpen, setMoreOpen] = useState<boolean>(false);
  const widthsCache = useRef<Record<string, number>>({});

  const allGroupsOrder = [
    'fontFamily',
    'fontSize',
    'formatting',
    'styling',
    'lists',
    'alignment',
    'history',
  ];

  // Priority order: groups at the start hide first when space is limited
  const priorities = [
    'fontFamily',
    'fontSize',
    'styling',
    'lists',
    'alignment',
    'formatting',
  ];

  /**
   * Determines if a separator should be shown after a group.
   * Separators are shown if the group is visible and there's at least one visible group after it.
   *
   * @param afterGroup - The group name to check
   * @returns True if separator should be shown after this group
   */
  const shouldShowSeparator = (afterGroup: string): boolean => {
    if (hiddenGroups.includes(afterGroup)) return false;

    const currentIndex = allGroupsOrder.indexOf(afterGroup);
    if (currentIndex === -1) return false;

    for (let i = currentIndex + 1; i < allGroupsOrder.length; i++) {
      if (!hiddenGroups.includes(allGroupsOrder[i])) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const GAP_SIZE = 8;
    const PADDING = 16;
    const MORE_BTN_WIDTH = 48;
    const SEPARATOR_WIDTH = 1;

    /**
     * Calculates which groups should be hidden based on available space.
     * Accounts for group widths, separators (1px), and gaps (8px) between all flex items.
     */
    const calculateHiddenGroups = () => {
      if (!el) return;

      const containerWidth = el.clientWidth;
      const availableWidth = containerWidth - PADDING;

      const groupNodes = Array.from(
        el.querySelectorAll('[data-group]'),
      ) as HTMLElement[];

      groupNodes.forEach((node) => {
        const name = node.dataset.group || '';
        if (node.offsetWidth > 0) {
          widthsCache.current[name] = node.offsetWidth;
        }
      });

      let totalWidth = 0;
      let groupCount = 0;

      allGroupsOrder.forEach((group) => {
        const width = widthsCache.current[group] || 0;
        if (width > 0) {
          totalWidth += width;
          groupCount++;
        }
      });

      // Separators: one between each pair of groups
      const separatorCount = Math.max(0, groupCount - 1);
      const totalItems = groupCount + separatorCount;

      // Add gaps between all flex items (groups AND separators) and separator widths
      totalWidth +=
        (totalItems - 1) * GAP_SIZE + separatorCount * SEPARATOR_WIDTH;

      if (totalWidth <= availableWidth) {
        setHiddenGroups([]);
        return;
      }

      // Account for More button and gap when hiding groups
      const availableForGroups = availableWidth - MORE_BTN_WIDTH - GAP_SIZE;

      const toHide: string[] = [];
      let visibleWidth = totalWidth;
      let currentVisibleCount = groupCount;

      for (const group of priorities) {
        const groupWidth = widthsCache.current[group] || 0;
        if (groupWidth === 0) continue;

        if (visibleWidth <= availableForGroups) break;

        toHide.push(group);
        currentVisibleCount--;

        // Hiding a group removes: group width + separator (1px) + 2 gaps (16px total)
        visibleWidth -= groupWidth + SEPARATOR_WIDTH + 2 * GAP_SIZE;
      }

      const changed =
        toHide.length !== hiddenGroups.length ||
        !toHide.every((g) => hiddenGroups.includes(g));

      if (changed) {
        setHiddenGroups(toHide);
      }
    };

    const initialTimer = setTimeout(calculateHiddenGroups, 100);

    const ro = new ResizeObserver(calculateHiddenGroups);
    ro.observe(el);

    window.addEventListener('resize', calculateHiddenGroups);

    return () => {
      clearTimeout(initialTimer);
      ro.disconnect();
      window.removeEventListener('resize', calculateHiddenGroups);
    };
  }, []);

  // Close dropdown when clicking outside toolbar and dropdown
  useEffect(() => {
    if (!moreOpen) return;

    const onDown = (e: MouseEvent) => {
      const toolbar = containerRef.current;
      const dropdown = dropdownRef.current;
      if (!toolbar) return;

      const isOutsideToolbar = !toolbar.contains(e.target as Node);
      const isOutsideDropdown =
        !dropdown || !dropdown.contains(e.target as Node);

      if (isOutsideToolbar && isOutsideDropdown) {
        setMoreOpen(false);
      }
    };

    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [moreOpen]);

  return {
    containerRef,
    dropdownRef,
    hiddenGroups,
    moreOpen,
    setMoreOpen,
    shouldShowSeparator,
  };
};
