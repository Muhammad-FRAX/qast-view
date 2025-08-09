// Simple API utility for authenticated requests
let token: string | null = null;

export function setToken(newToken: string | null) {
  token = newToken;
  if (token) {
    localStorage.setItem('qastview-jwt', token);
  } else {
    localStorage.removeItem('qastview-jwt');
  }
}

export function getToken(): string | null {
  if (token) return token;
  return localStorage.getItem('qastview-jwt');
}

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  requireAuth: boolean = true
) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedUrl = url.startsWith('/') ? url.slice(1) : url;
  const fullUrl = url.startsWith('http') ? url : `${normalizedBaseUrl}/${normalizedUrl}`;
  const headers: Record<string, string> = Object.assign(
    { 'Content-Type': 'application/json' },
    options.headers ? (options.headers as Record<string, string>) : {}
  );
  if (requireAuth) {
    const jwt = getToken();
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`;
  }
  const res = await fetch(fullUrl, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || res.statusText);
  }
  return res.json();
}