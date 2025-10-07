/**
 * Extracts the pull request number from environment variables.
 *
 * Prioritizes VITE_VERCEL_GIT_PULL_REQUEST_ID (Vercel's official PR ID variable),
 * and falls back to parsing the branch name from VITE_VERCEL_GIT_COMMIT_REF.
 *
 * @param env - Environment variables object
 * @returns The PR number as a string, or null if not found
 *
 * @example
 * // Using Vercel PR ID
 * getPRNumber({ VITE_VERCEL_GIT_PULL_REQUEST_ID: '42' }) // returns '42'
 *
 * @example
 * // Fallback to branch name parsing
 * getPRNumber({ VITE_VERCEL_GIT_COMMIT_REF: '123-feature' }) // returns '123'
 */
const getPRNumber = (env: Record<string, any>): string | null => {
  console.log('[getPRNumber] Input env keys:', Object.keys(env));

  const prId = env.VITE_VERCEL_GIT_PULL_REQUEST_ID;
  console.log('[getPRNumber] VITE_VERCEL_GIT_PULL_REQUEST_ID:', prId);

  if (prId && /^\d+$/.test(String(prId))) {
    console.log(
      '[getPRNumber] Using PR ID from VITE_VERCEL_GIT_PULL_REQUEST_ID:',
      String(prId),
    );
    return String(prId);
  }

  const branch = env.VITE_VERCEL_GIT_COMMIT_REF;
  console.log('[getPRNumber] VITE_VERCEL_GIT_COMMIT_REF:', branch);

  if (!branch) {
    console.log('[getPRNumber] No branch name found, returning null');
    return null;
  }

  const match = String(branch).match(/^(\d+)-/);
  console.log('[getPRNumber] Branch regex match:', match);

  const result = match ? match[1] : null;
  console.log('[getPRNumber] Final PR number:', result);

  return result;
};

/**
 * Determines the backend API URL based on the current environment.
 *
 * The URL is selected based on the following priority:
 * 1. Development: Returns localhost URL
 * 2. Production: Returns production Railway URL
 * 3. Preview (with PR): Returns PR-specific Railway URL using the PR number
 * 4. Preview (without PR): Falls back to production URL
 * 5. Default: Returns localhost URL
 *
 * @param env - Environment variables object (typically import.meta.env)
 * @returns The backend API base URL
 *
 * @example
 * // Development mode
 * getBackendUrl({ DEV: true }) // returns 'http://localhost:3000'
 *
 * @example
 * // Vercel preview with PR number
 * getBackendUrl({
 *   VITE_VERCEL_ENV: 'preview',
 *   VITE_VERCEL_GIT_PULL_REQUEST_ID: '42'
 * }) // returns 'https://backend-talkupai-pr-42.up.railway.app'
 *
 * @example
 * // Production mode
 * getBackendUrl({ VITE_VERCEL_ENV: 'production' })
 * // returns 'https://talk-up-ai.up.railway.app'
 */
export const getBackendUrl = (env: Record<string, any>): string => {
  console.log('[getBackendUrl] Starting with env:', {
    DEV: env.DEV,
    PROD: env.PROD,
    VITE_VERCEL_ENV: env.VITE_VERCEL_ENV,
    VITE_VERCEL_GIT_COMMIT_REF: env.VITE_VERCEL_GIT_COMMIT_REF,
    VITE_VERCEL_GIT_PULL_REQUEST_ID: env.VITE_VERCEL_GIT_PULL_REQUEST_ID,
  });

  if (env.DEV) {
    const url = env.VITE_BASE_URL || 'http://localhost:3000';
    console.log('[getBackendUrl] DEV mode, returning:', url);
    return url;
  }

  const isProduction =
    env.VITE_VERCEL_ENV === 'production' ||
    (env.PROD && env.VITE_VERCEL_ENV !== 'preview');
  console.log('[getBackendUrl] isProduction:', isProduction);

  if (isProduction) {
    const url =
      env.VITE_BASE_URL_PRODUCTION || 'https://talk-up-ai.up.railway.app';
    console.log('[getBackendUrl] Production mode, returning:', url);
    return url;
  }

  if (env.VITE_VERCEL_ENV === 'preview') {
    console.log('[getBackendUrl] Preview mode detected');

    const prNumber = getPRNumber(env);
    console.log('[getBackendUrl] Resolved PR number:', prNumber);

    if (prNumber) {
      const url = `https://backend-talkupai-pr-${prNumber}.up.railway.app`;
      console.log('[getBackendUrl] Preview with PR, returning:', url);
      return url;
    }

    const fallbackUrl =
      env.VITE_BASE_URL_PRODUCTION || 'https://talk-up-ai.up.railway.app';
    console.log(
      '[getBackendUrl] Preview without PR, falling back to:',
      fallbackUrl,
    );
    return fallbackUrl;
  }

  const defaultUrl = env.VITE_BASE_URL || 'http://localhost:3000';
  console.log(
    '[getBackendUrl] No condition matched, returning default:',
    defaultUrl,
  );
  return defaultUrl;
};

console.log('[env.ts] All environment variables:', import.meta.env);
export const API_BASE_URL = getBackendUrl(import.meta.env);
console.log('[env.ts] Final API_BASE_URL:', API_BASE_URL);
