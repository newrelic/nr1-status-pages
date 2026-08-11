export const PROXY_BASE = 'https://nr1-status-page-proxy.kpeet.workers.dev/';

export const viaProxy = (url) => `${PROXY_BASE}${url}`;

// Joins a base status-page URL with a provider-relative path, normalizing the
// single '/' between them regardless of whether either side already has one.
export const joinUrl = (base, path) => {
  if (!base) return path || '';
  if (!path) return base;
  const trimmedBase = base.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${normalizedPath}`;
};

// Shared allowlist check for URLs handed to the CORS proxy: only well-formed
// https URLs may be proxied.
export const isProxyableUrl = (rawUrl) => {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};
