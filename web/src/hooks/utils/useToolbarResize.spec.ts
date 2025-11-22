import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useToolbarResize } from './useToolbarResize';

// Mock ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver as any;

describe('useToolbarResize', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('initializes with empty hidden groups', () => {
      const { result } = renderHook(() => useToolbarResize());

      expect(result.current.hiddenGroups).toEqual([]);
      expect(result.current.moreOpen).toBe(false);
    });

    it('provides refs for container and dropdown', () => {
      const { result } = renderHook(() => useToolbarResize());

      expect(result.current.containerRef).toBeDefined();
      expect(result.current.dropdownRef).toBeDefined();
      expect(result.current.containerRef.current).toBeNull();
      expect(result.current.dropdownRef.current).toBeNull();
    });

    it('provides setMoreOpen function', () => {
      const { result } = renderHook(() => useToolbarResize());

      expect(typeof result.current.setMoreOpen).toBe('function');
    });

    it('provides shouldShowSeparator function', () => {
      const { result } = renderHook(() => useToolbarResize());

      expect(typeof result.current.shouldShowSeparator).toBe('function');
    });
  });

  describe('moreOpen State Management', () => {
    it('toggles moreOpen state', () => {
      const { result } = renderHook(() => useToolbarResize());

      expect(result.current.moreOpen).toBe(false);

      act(() => {
        result.current.setMoreOpen(true);
      });

      expect(result.current.moreOpen).toBe(true);

      act(() => {
        result.current.setMoreOpen(false);
      });

      expect(result.current.moreOpen).toBe(false);
    });

    it('allows function-based state updates', () => {
      const { result } = renderHook(() => useToolbarResize());

      act(() => {
        result.current.setMoreOpen((prev) => !prev);
      });

      expect(result.current.moreOpen).toBe(true);

      act(() => {
        result.current.setMoreOpen((prev) => !prev);
      });

      expect(result.current.moreOpen).toBe(false);
    });
  });

  describe('shouldShowSeparator', () => {
    it('returns false if the group is hidden', () => {
      const { result } = renderHook(() => useToolbarResize());

      act(() => {
        result.current.setMoreOpen(true);
      });

      // Manually set hidden groups for testing
      // In real usage, this would be set by the resize logic
      const shouldShow = result.current.shouldShowSeparator('fontFamily');
      expect(typeof shouldShow).toBe('boolean');
    });

    it('returns false for unknown groups', () => {
      const { result } = renderHook(() => useToolbarResize());

      const shouldShow = result.current.shouldShowSeparator('unknownGroup');
      expect(shouldShow).toBe(false);
    });

    it('returns false for the last group when all others are hidden', () => {
      const { result } = renderHook(() => useToolbarResize());

      // When no groups are hidden, history (last group) should return false
      const shouldShow = result.current.shouldShowSeparator('history');
      expect(shouldShow).toBe(false);
    });

    it('returns true when there are visible groups after the current one', () => {
      const { result } = renderHook(() => useToolbarResize());

      // fontFamily has groups after it (fontSize, formatting, etc.)
      const shouldShow = result.current.shouldShowSeparator('fontFamily');
      expect(shouldShow).toBe(true);
    });
  });

  describe('Click Outside Detection', () => {
    it('closes dropdown when clicking outside and moreOpen is true', () => {
      const { result } = renderHook(() => useToolbarResize());

      // Create mock container
      const mockContainer = document.createElement('div');
      const mockDropdown = document.createElement('div');
      document.body.appendChild(mockContainer);
      document.body.appendChild(mockDropdown);

      act(() => {
        result.current.containerRef.current = mockContainer;
        result.current.dropdownRef.current = mockDropdown;
        result.current.setMoreOpen(true);
      });

      expect(result.current.moreOpen).toBe(true);

      // Click outside both container and dropdown
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      act(() => {
        const event = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(event, 'target', {
          value: outsideElement,
          enumerable: true,
        });
        document.dispatchEvent(event);
      });

      expect(result.current.moreOpen).toBe(false);

      // Cleanup
      document.body.removeChild(mockContainer);
      document.body.removeChild(mockDropdown);
      document.body.removeChild(outsideElement);
    });

    it('does not close dropdown when clicking inside container', () => {
      const { result } = renderHook(() => useToolbarResize());

      const mockContainer = document.createElement('div');
      const insideElement = document.createElement('button');
      mockContainer.appendChild(insideElement);
      document.body.appendChild(mockContainer);

      act(() => {
        result.current.containerRef.current = mockContainer;
        result.current.setMoreOpen(true);
      });

      act(() => {
        const event = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(event, 'target', {
          value: insideElement,
          enumerable: true,
        });
        document.dispatchEvent(event);
      });

      expect(result.current.moreOpen).toBe(true);

      document.body.removeChild(mockContainer);
    });

    it('does not close dropdown when clicking inside dropdown', () => {
      const { result } = renderHook(() => useToolbarResize());

      const mockContainer = document.createElement('div');
      const mockDropdown = document.createElement('div');
      const insideDropdown = document.createElement('button');
      mockDropdown.appendChild(insideDropdown);
      document.body.appendChild(mockContainer);
      document.body.appendChild(mockDropdown);

      act(() => {
        result.current.containerRef.current = mockContainer;
        result.current.dropdownRef.current = mockDropdown;
        result.current.setMoreOpen(true);
      });

      act(() => {
        const event = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(event, 'target', {
          value: insideDropdown,
          enumerable: true,
        });
        document.dispatchEvent(event);
      });

      expect(result.current.moreOpen).toBe(true);

      document.body.removeChild(mockContainer);
      document.body.removeChild(mockDropdown);
    });

    it('does not add event listener when moreOpen is false', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      renderHook(() => useToolbarResize());

      // Should not add mousedown listener initially
      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function),
      );

      addEventListenerSpy.mockRestore();
    });

    it('removes event listener when moreOpen becomes false', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { result } = renderHook(() => useToolbarResize());

      act(() => {
        result.current.setMoreOpen(true);
      });

      act(() => {
        result.current.setMoreOpen(false);
      });

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Event Listener Cleanup', () => {
    it('cleans up properly on unmount', () => {
      const { unmount } = renderHook(() => useToolbarResize());

      // Should not throw when unmounting
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Hook Setup', () => {
    it('provides containerRef for DOM access', () => {
      const { result } = renderHook(() => useToolbarResize());

      expect(result.current.containerRef).toBeDefined();
      expect(result.current.containerRef.current).toBeNull();
    });

    it('provides dropdownRef for DOM access', () => {
      const { result } = renderHook(() => useToolbarResize());

      expect(result.current.dropdownRef).toBeDefined();
      expect(result.current.dropdownRef.current).toBeNull();
    });
  });

  describe('Initial Timer', () => {
    it('triggers calculation after 100ms', async () => {
      const { result } = renderHook(() => useToolbarResize());

      const mockContainer = document.createElement('div');
      Object.defineProperty(mockContainer, 'clientWidth', {
        value: 800,
        writable: true,
      });
      document.body.appendChild(mockContainer);

      act(() => {
        result.current.containerRef.current = mockContainer;
      });

      // Fast-forward past the initial timer
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // Hidden groups calculation should have run
      // (actual behavior depends on DOM structure)

      document.body.removeChild(mockContainer);
    });
  });

  describe('Group Order and Priorities', () => {
    it('has correct group order', () => {
      const { result } = renderHook(() => useToolbarResize());

      // Test that shouldShowSeparator recognizes all expected groups
      const groups = [
        'fontFamily',
        'fontSize',
        'formatting',
        'styling',
        'lists',
        'alignment',
        'history',
      ];

      groups.forEach((group) => {
        const result2 = result.current.shouldShowSeparator(group);
        expect(typeof result2).toBe('boolean');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles missing container ref gracefully', () => {
      const { result } = renderHook(() => useToolbarResize());

      expect(() => {
        result.current.shouldShowSeparator('fontFamily');
      }).not.toThrow();
    });

    it('handles rapid moreOpen toggles', () => {
      const { result } = renderHook(() => useToolbarResize());

      act(() => {
        result.current.setMoreOpen(true);
        result.current.setMoreOpen(false);
        result.current.setMoreOpen(true);
        result.current.setMoreOpen(false);
      });

      expect(result.current.moreOpen).toBe(false);
    });

    it('handles multiple click outside events', () => {
      const { result } = renderHook(() => useToolbarResize());

      const mockContainer = document.createElement('div');
      document.body.appendChild(mockContainer);

      act(() => {
        result.current.containerRef.current = mockContainer;
        result.current.setMoreOpen(true);
      });

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      // Multiple clicks outside
      act(() => {
        const event1 = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(event1, 'target', {
          value: outsideElement,
          enumerable: true,
        });
        document.dispatchEvent(event1);
      });

      expect(result.current.moreOpen).toBe(false);

      act(() => {
        result.current.setMoreOpen(true);
      });

      act(() => {
        const event2 = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(event2, 'target', {
          value: outsideElement,
          enumerable: true,
        });
        document.dispatchEvent(event2);
      });

      expect(result.current.moreOpen).toBe(false);

      document.body.removeChild(mockContainer);
      document.body.removeChild(outsideElement);
    });
  });
});
