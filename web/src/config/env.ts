export const getPRNumber = (branchName: string | undefined): string | null => {
  if (!branchName) return null;
  // branch names like `82-railway-integration` -> 82
  const match = branchName.match(/^(\d+)-/);
  return match ? match[1] : null;
};

export const getPRNumberFromEnv = (env: Record<string, any>): string | null => {
  // Vercel and GitHub set different env vars depending on the integration.
  // Check several common ones (prefixed with VITE_ in Vite builds):
  const candidates = [
    'VITE_VERCEL_GIT_PULL_REQUEST',
    'VITE_VERCEL_GIT_PULL_REQUEST_NUMBER',
    'VITE_GITHUB_PR_NUMBER',
    'VITE_PR_NUMBER',
    'VITE_VERCEL_PULL_REQUEST',
    // non-VITE names (in case you expose them to client builds differently)
    'VERCEL_GIT_PULL_REQUEST',
    'VERCEL_PULL_REQUEST',
    'GITHUB_PR_NUMBER',
  ];

  for (const name of candidates) {
    const v = env[name];
    if (!v) continue;
    const s = String(v).trim().replace(/^#/, '');
    if (s && /^\d+$/.test(s)) return s;
  }

  return null;
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
    return env.VITE_BASE_URL_PRODUCTION || 'https://talk-up-ai.up.railway.app';
  }

  if (VERCEL_ENV === 'preview') {
    // Prefer PR number passed through environment vars (Vercel/GitHub),
    // fall back to parsing the branch name (legacy behavior).
    const prFromEnv = getPRNumberFromEnv(env);
    const prFromBranch = getPRNumber(VERCEL_GIT_COMMIT_REF);
    const prNumber = prFromEnv || prFromBranch;

    console.log('Detected PR number:', { prFromEnv, prFromBranch, prNumber });

    if (prNumber) {
      return `https://backend-talkupai-pr-${prNumber}.up.railway.app`;
    }

    return env.VITE_BASE_URL_PRODUCTION || 'https://talk-up-ai.up.railway.app';
  }

  return env.VITE_BASE_URL || 'http://localhost:3000';
};

console.log('Environment variables:', {
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  VITE_VERCEL_ENV: import.meta.env.VITE_VERCEL_ENV,
  VITE_VERCEL_GIT_COMMIT_REF: import.meta.env.VITE_VERCEL_GIT_COMMIT_REF,
  VITE_GITHUB_PR_NUMBER: import.meta.env.VITE_GITHUB_PR_NUMBER,
  VITE_PR_NUMBER: import.meta.env.VITE_PR_NUMBER,
  VITE_VERCEL_GIT_PULL_REQUEST: import.meta.env.VITE_VERCEL_GIT_PULL_REQUEST,
  VITE_VERCEL_GIT_PULL_REQUEST_NUMBER:
    import.meta.env.VITE_VERCEL_GIT_PULL_REQUEST_NUMBER,
});

export const API_BASE_URL = getBackendUrl(import.meta.env);
