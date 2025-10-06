import { describe, expect, it } from 'vitest';

import { getBackendUrl, getPRNumber } from './env';

describe('getPRNumber', () => {
  it('should extract PR number from branch name', () => {
    expect(getPRNumber('42-add-feature')).toBe('42');
  });

  it('should handle multi-digit PR numbers', () => {
    expect(getPRNumber('123-fix-bug')).toBe('123');
  });

  it('should return null when no PR number at start', () => {
    expect(getPRNumber('feature-branch')).toBeNull();
  });

  it('should return null when branchName is undefined', () => {
    expect(getPRNumber(undefined)).toBeNull();
  });
});

describe('getBackendUrl', () => {
  describe('Local development', () => {
    it('should use VITE_BASE_URL when DEV is true', () => {
      const env = { DEV: true, VITE_BASE_URL: 'http://localhost:3000' };
      expect(getBackendUrl(env)).toBe('http://localhost:3000');
    });

    it('should fallback to localhost:3000 when VITE_BASE_URL is not set', () => {
      const env = { DEV: true };
      expect(getBackendUrl(env)).toBe('http://localhost:3000');
    });
  });

  describe('Production', () => {
    it('should use VITE_BASE_URL_PRODUCTION when VERCEL_ENV is production', () => {
      const env = {
        VITE_VERCEL_ENV: 'production',
        VITE_BASE_URL_PRODUCTION: 'https://prod.railway.app',
      };
      expect(getBackendUrl(env)).toBe('https://prod.railway.app');
    });

    it('should use VITE_BASE_URL_PRODUCTION when PROD is true', () => {
      const env = {
        PROD: true,
        VITE_BASE_URL_PRODUCTION: 'https://prod.railway.app',
      };
      expect(getBackendUrl(env)).toBe('https://prod.railway.app');
    });

    it('should fallback to default production URL when not set', () => {
      const env = { VITE_VERCEL_ENV: 'production' };
      expect(getBackendUrl(env)).toBe('https://talk-up-ai.up.railway.app');
    });
  });

  describe('Preview with PR number', () => {
    it('should construct Railway URL from PR number', () => {
      const env = {
        VITE_VERCEL_ENV: 'preview',
        VITE_VERCEL_GIT_COMMIT_REF: '42-add-feature',
      };
      expect(getBackendUrl(env)).toBe(
        'https://talk-up-server-talkupai-pr-42.up.railway.app',
      );
    });

    it('should handle multi-digit PR numbers', () => {
      const env = {
        VITE_VERCEL_ENV: 'preview',
        VITE_VERCEL_GIT_COMMIT_REF: '123-fix-bug',
      };
      expect(getBackendUrl(env)).toBe(
        'https://talk-up-server-talkupai-pr-123.up.railway.app',
      );
    });

    it('should fallback to production when PR number not found', () => {
      const env = {
        VITE_VERCEL_ENV: 'preview',
        VITE_VERCEL_GIT_COMMIT_REF: 'feature-branch',
        VITE_BASE_URL_PRODUCTION: 'https://prod.railway.app',
      };
      expect(getBackendUrl(env)).toBe('https://prod.railway.app');
    });

    it('should fallback when VERCEL_GIT_COMMIT_REF is missing', () => {
      const env = {
        VITE_VERCEL_ENV: 'preview',
        VITE_BASE_URL_PRODUCTION: 'https://prod.railway.app',
      };
      expect(getBackendUrl(env)).toBe('https://prod.railway.app');
    });
  });

  describe('Default fallback', () => {
    it('should fallback to localhost when no environment matches', () => {
      const env = {};
      expect(getBackendUrl(env)).toBe('http://localhost:3000');
    });

    it('should use VITE_BASE_URL as final fallback', () => {
      const env = { VITE_BASE_URL: 'http://custom:4000' };
      expect(getBackendUrl(env)).toBe('http://custom:4000');
    });
  });
});
