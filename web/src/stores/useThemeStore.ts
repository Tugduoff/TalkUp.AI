import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Available theme options
 */
export type Theme = 'light' | 'dark';

/**
 * Theme store state and actions
 */
interface ThemeStore {
  /** Current active theme */
  theme: Theme;
  /** Set the theme to a specific value */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
}

/**
 * Zustand store for managing application theme
 *
 * Features:
 * - Persists theme preference to localStorage
 * - Default theme is 'light'
 * - Stored under 'theme-storage' key in localStorage
 *
 * @example
 * ```tsx
 * import useThemeStore from '@/stores/useThemeStore';
 *
 * function MyComponent() {
 *   const theme = useThemeStore((state) => state.theme);
 *   const toggleTheme = useThemeStore((state) => state.toggleTheme);
 *
 *   return <button onClick={toggleTheme}>Current: {theme}</button>;
 * }
 * ```
 */
const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'theme-storage',
    },
  ),
);

export default useThemeStore;
