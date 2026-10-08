import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from './api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const withMail = (d) => ({ ...d.admin, mailFrom: d.mailFrom });

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api('/me').then((d) => setAdmin(withMail(d))).catch(() => setToken(null)).finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    const onLogout = () => setAdmin(null);
    window.addEventListener('admin-logout', onLogout);
    return () => window.removeEventListener('admin-logout', onLogout);
  }, []);

  const login = useCallback(async (email, password) => {
    const d = await api('/login', { method: 'POST', body: { email, password } });
    setToken(d.token);
    setAdmin(withMail(d));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
  }, []);

  const value = useMemo(() => ({ admin, checking, login, logout }), [admin, checking, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
