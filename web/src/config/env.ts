export const getPRNumber = (branchName: string | undefined): string | null => {
  if (!branchName) return null;
  const match = branchName.match(/^(\d+)-/);
  return match ? match[1] : null;
};

export const getBackendUrl = (env: Record<string, any>): string => {
  const isDev = env.DEV;
  const isProd = env.PROD;
  const VERCEL_ENV = env.VITE_VERCEL_ENV;
  const VERCEL_GIT_COMMIT_REF = env.VITE_VERCEL_GIT_COMMIT_REF;

  if (isDev) {
    return env.VITE_BASE_URL || 'http://localhost:3000';
  }

  if (VERCEL_ENV === 'production' || (isProd && VERCEL_ENV !== 'preview')) {
    return (
      env.VITE_BASE_URL_PRODUCTION ||
      'https://talk-up-server-production.up.railway.app'
    );
  }

  if (VERCEL_ENV === 'preview') {
    const prNumber = getPRNumber(VERCEL_GIT_COMMIT_REF);
    if (prNumber) {
      return `https://talk-up-server-talkupai-pr-${prNumber}.up.railway.app`;
    }
    return (
      env.VITE_BASE_URL_PRODUCTION ||
      'https://talk-up-server-production.up.railway.app'
    );
  }

  return env.VITE_BASE_URL || 'http://localhost:3000';
};

export const API_BASE_URL = getBackendUrl(import.meta.env);
