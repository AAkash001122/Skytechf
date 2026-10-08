const API_URL = import.meta.env.VITE_API_URL ?? '';
const KEY = 'skytech_admin_token';

export const getToken = () => {
  try { return sessionStorage.getItem(KEY); } catch { return null; }
};
export const setToken = (t) => {
  try {
    if (t) sessionStorage.setItem(KEY, t);
    else sessionStorage.removeItem(KEY);
  } catch { /* storage unavailable */ }
};

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${API_URL}/api/admin${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token) {
    setToken(null);
    window.dispatchEvent(new Event('admin-logout'));
  }
  if (!res.ok) {
    throw new ApiError(data.message || data.errors?.body || 'Request failed.', res.status, data.errors);
  }
  return data;
}
