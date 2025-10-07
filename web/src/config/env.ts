const getPRNumber = (env: Record<string, any>): string | null => {
  const prId = env.VITE_VERCEL_GIT_PULL_REQUEST_ID;
  if (prId && /^\d+$/.test(String(prId))) return String(prId);

  const branch = env.VITE_VERCEL_GIT_COMMIT_REF;
  if (!branch) return null;

  const match = String(branch).match(/^(\d+)-/);
  return match ? match[1] : null;
};

export const getBackendUrl = (env: Record<string, any>): string => {
  if (env.DEV) return env.VITE_BASE_URL || 'http://localhost:3000';

  const isProduction =
    env.VITE_VERCEL_ENV === 'production' ||
    (env.PROD && env.VITE_VERCEL_ENV !== 'preview');

  if (isProduction) {
    return env.VITE_BASE_URL_PRODUCTION || 'https://talk-up-ai.up.railway.app';
  }

  if (env.VITE_VERCEL_ENV === 'preview') {
    const prNumber = getPRNumber(env);
    if (prNumber) {
      return `https://backend-talkupai-pr-${prNumber}.up.railway.app`;
    }
    return env.VITE_BASE_URL_PRODUCTION || 'https://talk-up-ai.up.railway.app';
  }

  return env.VITE_BASE_URL || 'http://localhost:3000';
};

export const API_BASE_URL = getBackendUrl(import.meta.env);
