import useThemeStore, { Theme } from '@/stores/useThemeStore';
import React, { createContext, useContext, useLayoutEffect } from 'react';

/**
 * Context value type for theme management
 */
interface ThemeContextType {
  /** Current active theme ('light' | 'dark') */
  theme: Theme;
  /** Set the theme to a specific value */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
}

/**
 * React context for theme management
 * @private
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Hook to access theme context and controls
 *
 * @returns {ThemeContextType} Theme state and control functions
 * @throws {Error} If used outside of ThemeProvider
 *
 * @example
 * function MyComponent() {
 *   const { theme, toggleTheme, setTheme } = useTheme();
 *
 *   return (
 *     <div>
 *       <p>Current theme: {theme}</p>
 *       <button onClick={toggleTheme}>Toggle Theme</button>
 *       <button onClick={() => setTheme('dark')}>Set Dark</button>
 *     </div>
 *   );
 * }
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Props for ThemeProvider component
 */
interface ThemeProviderProps {
  /** React children to be wrapped with theme context */
  children: React.ReactNode;
}

/**
 * ThemeProvider component that manages application-wide theme state
 *
 * This provider:
 * - Wraps the application to provide theme context
 * - Persists theme preference to localStorage via Zustand
 * - Applies theme class to document root element
 * - Updates browser color-scheme for native element styling
 * - Uses useLayoutEffect to prevent flash of unstyled content (FOUC)
 *
 * @component
 * @param {ThemeProviderProps} props - Component props
 * @returns {JSX.Element} Provider component wrapping children
 *
 * @example
 * // In your app root (main.tsx)
 * import { ThemeProvider } from '@/contexts/ThemeContext';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 *
 * @example
 * // Using theme in a component
 * import { useTheme } from '@/contexts/ThemeContext';
 *
 * function MyComponent() {
 *   const { theme, toggleTheme } = useTheme();
 *
 *   return (
 *     <button onClick={toggleTheme}>
 *       Switch to {theme === 'light' ? 'dark' : 'light'} mode
 *     </button>
 *   );
 * }
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  // Use useLayoutEffect to apply theme before paint (prevents flash)
  useLayoutEffect(() => {
    const root = window.document.documentElement;

    // Remove both classes to ensure clean state
    root.classList.remove('light', 'dark');

    // Add the current theme class to enable CSS variables
    root.classList.add(theme);

    // Update color-scheme for browser native elements (scrollbars, inputs, etc.)
    const colorScheme = theme === 'dark' ? 'dark' : 'light';
    root.style.colorScheme = colorScheme;
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
