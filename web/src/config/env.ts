// Dynamic environment configuration for Vercel previews
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// Vercel system environment variables
const VERCEL_ENV = import.meta.env.VITE_VERCEL_ENV; // 'production' | 'preview' | 'development'
const VERCEL_GIT_COMMIT_REF = import.meta.env.VITE_VERCEL_GIT_COMMIT_REF; // branch name

// Extract PR number from branch name (e.g., "85-feature-name" -> "85")
const getPRNumber = (): string | null => {
  if (!VERCEL_GIT_COMMIT_REF) return null;
  const match = VERCEL_GIT_COMMIT_REF.match(/^(\d+)-/);
  return match ? match[1] : null;
};

// Determine backend URL
const getBackendUrl = (): string => {
  // Local development
  if (isDev) {
    return import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
  }

  // Production
  if (VERCEL_ENV === 'production' || isProd) {
    return import.meta.env.VITE_BASE_URL_PRODUCTION || 'https://talk-up-server-production.up.railway.app';
  }

  // Preview/PR environment
  if (VERCEL_ENV === 'preview') {
    const prNumber = getPRNumber();

    // If we can extract PR number from branch, use Railway PR environment
    if (prNumber) {
      return `https://talk-up-server-talkupai-pr-${prNumber}.up.railway.app`;
    }

    // Fallback to production backend for preview deployments
    return import.meta.env.VITE_BASE_URL_PRODUCTION || 'https://talk-up-server-production.up.railway.app';
  }

  // Default fallback
  return import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
};

export const API_BASE_URL = getBackendUrl();

console.log('Environment:', {
  VERCEL_ENV,
  VERCEL_GIT_COMMIT_REF,
  API_BASE_URL
});
