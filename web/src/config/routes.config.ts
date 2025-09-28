export interface RouteConfig {
  path: string;
  requiresAuth: boolean;
  roles?: string[];
}

export const routeConfigs: RouteConfig[] = [
  { path: '/', requiresAuth: false },
  { path: '/login', requiresAuth: false },
  { path: '/signup', requiresAuth: false },
  { path: '/about', requiresAuth: false },

  { path: '/dashboard', requiresAuth: true },
  { path: '/profile', requiresAuth: true },
  { path: '/cv-analysis', requiresAuth: true },
  { path: '/simulations', requiresAuth: true },
  { path: '/progression', requiresAuth: true },
  { path: '/diary', requiresAuth: true },
  { path: '/notes', requiresAuth: true },
  { path: '/ai-chat', requiresAuth: true },
];

/**
 * Retrieves the route configuration object that matches the specified path.
 *
 * @param path - The path string to search for in the route configurations.
 * @returns The corresponding `RouteConfig` object if found; otherwise, `undefined`.
 */
export const getRouteConfig = (path: string): RouteConfig | undefined => {
  return routeConfigs.find(config => config.path === path);
};

/**
 * Determines whether a given route path requires authentication.
 *
 * @param path - The route path to check.
 * @returns `true` if the route requires authentication, otherwise `false`.
 */
export const isProtectedRoute = (path: string): boolean => {
  const config = getRouteConfig(path);
  return config?.requiresAuth ?? false;
};

/**
 * Determines if a given route path is public.
 *
 * @param path - The route path to check.
 * @returns `true` if the route is public, otherwise `false`.
 */
export const isPublicRoute = (path: string): boolean => {
  return !isProtectedRoute(path);
};
