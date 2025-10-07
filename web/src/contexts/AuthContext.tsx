import { User } from '@/types/user';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

/**
 * Authentication context interface defining the shape of authentication state and methods.
 *
 * @interface AuthContextType
 */
export interface AuthContextType {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** Current user object containing user details */
  user: User | null;
  /** Authentication token (JWT) */
  token: string | null;
  /** Function to log in a user with token and optional user data */
  login: (token: string, user?: User) => void;
  /** Function to log out the current user */
  logout: () => void;
  /** Whether authentication state is still being determined */
  isLoading: boolean;
}

/**
 * React context for managing authentication state across the application.
 * Provides authentication status, user data, and authentication methods.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to access authentication context.
 * Must be used within an AuthProvider component.
 *
 * @returns {AuthContextType} The authentication context containing state and methods
 * @throws {Error} If used outside of AuthProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isAuthenticated, user, login, logout } = useAuth();
 *
 *   return (
 *     <div>
 *       {isAuthenticated ? (
 *         <div>
 *           <p>Welcome, {user?.firstName}!</p>
 *           <button onClick={logout}>Logout</button>
 *         </div>
 *       ) : (
 *         <button onClick={() => login('token', userData)}>Login</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Props for the AuthProvider component.
 */
interface AuthProviderProps {
  /** Child components that will have access to the authentication context */
  children: ReactNode;
}

/**
 * Authentication provider component that wraps the application and provides
 * authentication context to all child components.
 *
 * Manages authentication state including user login status, user data, and tokens.
 * Automatically validates stored tokens on app initialization.
 *
 * @param {AuthProviderProps} props - The component props
 * @param {ReactNode} props.children - Child components to wrap with auth context
 *
 * @example
 * ```tsx
 * // Wrap your app with AuthProvider
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <Router>
 *         <Routes>...</Routes>
 *       </Router>
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Logs in a user with the provided token and optional user data.
   * Stores the token in localStorage and updates authentication state.
   *
   * @param {string} newToken - The authentication token (JWT) received from the server
   * @param {User} [userData] - Optional user data to store in the context
   */
  const login = (newToken: string, userData?: User) => {
    localStorage.setItem('idToken', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    }
  };

  /**
   * Logs out the current user by clearing all authentication data.
   * Removes token from localStorage and resets all authentication state.
   */
  const logout = () => {
    localStorage.removeItem('idToken');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  /**
   * Validates a JWT token by checking its structure and expiration.
   * Decodes the token payload and verifies it hasn't expired.
   *
   * @param {string} tokenToValidate - The JWT token to validate
   * @returns {boolean} True if the token is valid and not expired, false otherwise
   *
   * @example
   * ```tsx
   * const isValid = validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
   * if (!isValid) {
   *   // Token is invalid or expired
   *   logout();
   * }
   * ```
   */
  const validateToken = (tokenToValidate: string): boolean => {
    if (!tokenToValidate) return false;

    try {
      // Decode JWT payload (second part of the token)
      const payload = JSON.parse(atob(tokenToValidate.split('.')[1]));
      const currentTime = Date.now() / 1000;

      // Check if token has expired
      if (payload.exp && payload.exp < currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  /**
   * Initialize authentication state on component mount.
   * Checks for stored token in localStorage and validates it.
   * If token is invalid or expired, it's removed from storage.
   */
  useEffect(() => {
    /**
     * Internal function to initialize authentication state.
     * Validates stored tokens and sets up initial auth state.
     */
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('idToken');

      if (storedToken && validateToken(storedToken)) {
        // Token is valid, set authenticated state
        setToken(storedToken);
        setIsAuthenticated(true);
      } else if (storedToken) {
        // Token exists but is invalid/expired, clean it up
        localStorage.removeItem('idToken');
      }

      // Authentication initialization complete
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Create the context value object with all auth state and methods
  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
