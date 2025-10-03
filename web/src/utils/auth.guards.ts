import { getRouteConfig } from '@/config/routes.config';
import { redirect } from '@tanstack/react-router';

export interface AuthGuardContext {
  isAuthenticated: boolean;
  token: string | null;
}

/**
 * Validates a JWT token by checking its existence, decoding its payload,
 * and verifying its expiration time.
 *
 * @param token - The JWT token string to validate.
 * @returns `true` if the token is valid and not expired; otherwise, `false`.
 */
const validateToken = (token: string): boolean => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

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
 * Creates an authentication guard function for a given route path.
 *
 * The returned async function checks if the route requires authentication.
 * If authentication is required, it verifies the presence and validity of an `idToken` in localStorage.
 * If the token is missing or invalid, it removes the token and throws a redirect to the login page,
 * including the original route path in the redirect query parameters.
 *
 * @param routePath - The path of the route to guard.
 * @returns An async function that enforces authentication for the specified route.
 * @throws Redirects to the login page if authentication fails.
 */
export const createAuthGuard = (routePath: string) => {
  return async () => {
    const config = getRouteConfig(routePath);

    if (!config?.requiresAuth) {
      return;
    }

    const token = localStorage.getItem('idToken');

    if (!token || !validateToken(token)) {
      localStorage.removeItem('idToken');
      throw redirect({
        to: '/login',
        search: {
          redirect: routePath,
        },
      });
    }
  };
};

/**
 * Creates a guard function for public routes such as '/login' and '/signup'.
 * If a valid authentication token exists in localStorage, the user is redirected to '/dashboard'.
 * Otherwise, the route is accessible.
 *
 * @param routePath - The path of the route to guard (e.g., '/login', '/signup').
 * @returns An asynchronous guard function to be used in route protection.
 *
 * @throws Redirects to '/dashboard' if a valid token is found.
 */
export const createPublicRouteGuard = (routePath: string) => {
  return async () => {
    if (routePath !== '/login' && routePath !== '/signup') {
      return;
    }

    const token = localStorage.getItem('idToken');

    if (token && validateToken(token)) {
      throw redirect({
        to: '/dashboard',
      });
    }
  };
};
