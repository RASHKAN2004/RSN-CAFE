const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const KEY = 'rsn_token';

export const getToken = () => (typeof window === 'undefined' ? null : localStorage.getItem(KEY));
export const setToken = (t) => (t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY));

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
  } catch {
    throw new Error('Cannot reach the server. Check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong.');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/** Only allow same-site relative redirects (prevents open-redirect). */
export const safeNext = (n) => (n && n.startsWith('/') && !n.startsWith('//') ? n : '/');
