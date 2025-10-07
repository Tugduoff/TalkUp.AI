import { describe, expect, it } from 'vitest';

import {
  getRouteConfig,
  isProtectedRoute,
  isPublicRoute,
  routeConfigs,
} from './routes.config';

/**
 * Test suite for the routes configuration system.
 * Verifies route configuration data and helper functions work correctly.
 */
describe('routes.config', () => {
  describe('routeConfigs', () => {
    it('contains expected route configurations', () => {
      expect(routeConfigs).toBeInstanceOf(Array);
      expect(routeConfigs.length).toBeGreaterThan(0);
    });

    it('has correct structure for each route config', () => {
      routeConfigs.forEach((config) => {
        expect(config).toHaveProperty('path');
        expect(config).toHaveProperty('requiresAuth');
        expect(typeof config.path).toBe('string');
        expect(typeof config.requiresAuth).toBe('boolean');
      });
    });

    it('contains protected routes', () => {
      const protectedRoutes = routeConfigs.filter(
        (config) => config.requiresAuth,
      );
      expect(protectedRoutes.length).toBeGreaterThan(0);
    });

    it('contains public routes', () => {
      const publicRoutes = routeConfigs.filter(
        (config) => !config.requiresAuth,
      );
      expect(publicRoutes.length).toBeGreaterThan(0);
    });
  });

  describe('getRouteConfig', () => {
    it('returns correct config for existing route', () => {
      const config = getRouteConfig('/dashboard');
      expect(config).toBeDefined();
      expect(config?.path).toBe('/dashboard');
      expect(config?.requiresAuth).toBe(true);
    });

    it('returns undefined for non-existing route', () => {
      const config = getRouteConfig('/non-existing-route');
      expect(config).toBeUndefined();
    });

    it('returns correct config for login route', () => {
      const config = getRouteConfig('/login');
      expect(config).toBeDefined();
      expect(config?.path).toBe('/login');
      expect(config?.requiresAuth).toBe(false);
    });

    it('returns correct config for signup route', () => {
      const config = getRouteConfig('/signup');
      expect(config).toBeDefined();
      expect(config?.path).toBe('/signup');
      expect(config?.requiresAuth).toBe(false);
    });
  });

  describe('isProtectedRoute', () => {
    it('returns true for protected routes', () => {
      expect(isProtectedRoute('/dashboard')).toBe(true);
      expect(isProtectedRoute('/profile')).toBe(true);
      expect(isProtectedRoute('/progression')).toBe(true);
      expect(isProtectedRoute('/simulations')).toBe(true);
    });

    it('returns false for public routes', () => {
      expect(isProtectedRoute('/login')).toBe(false);
      expect(isProtectedRoute('/signup')).toBe(false);
    });

    it('returns false for non-existing routes', () => {
      expect(isProtectedRoute('/non-existing-route')).toBe(false);
    });
  });

  describe('isPublicRoute', () => {
    it('returns true for public routes', () => {
      expect(isPublicRoute('/login')).toBe(true);
      expect(isPublicRoute('/signup')).toBe(true);
    });

    it('returns false for protected routes', () => {
      expect(isPublicRoute('/dashboard')).toBe(false);
      expect(isPublicRoute('/profile')).toBe(false);
      expect(isPublicRoute('/progression')).toBe(false);
      expect(isPublicRoute('/simulations')).toBe(false);
    });

    it('returns true for non-existing routes', () => {
      expect(isPublicRoute('/non-existing-route')).toBe(true);
    });
  });

  describe('route configuration consistency', () => {
    it('ensures no route is both public and protected', () => {
      routeConfigs.forEach((config) => {
        const isProtected = isProtectedRoute(config.path);
        const isPublic = isPublicRoute(config.path);
        expect(isProtected && isPublic).toBe(false);
      });
    });

    it('ensures all configured routes are either public or protected', () => {
      routeConfigs.forEach((config) => {
        const isProtected = isProtectedRoute(config.path);
        const isPublic = isPublicRoute(config.path);
        expect(isProtected || isPublic).toBe(true);
      });
    });
  });
});
