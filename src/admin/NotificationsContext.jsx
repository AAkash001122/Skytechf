import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from './api';

const NotificationsContext = createContext(null);
export const useNotifications = () => useContext(NotificationsContext);

const POLL_MS = 15000;

/**
 * Polls /api/admin/notifications. Read state lives in MongoDB (Lead.isRead), so the count
 * survives refreshes and logins; this provider only mirrors it. When `enabled` is false (no admin
 * signed in) it makes no requests and reports zero, so public visitors never poll or see counts.
 */
export function NotificationsProvider({ enabled = true, children }) {
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const seen = useRef(null); // ids already known; null until the first fetch so old unread messages do not toast

  const refresh = useCallback(async () => {
    try {
      const d = await api('/notifications');
      setUnread(d.unread);
      setItems(d.items);
      if (seen.current) {
        const fresh = d.items.filter((i) => !seen.current.has(i._id));
        if (fresh.length) setToast(fresh[0]);
      }
      seen.current = new Set(d.items.map((i) => i._id));
    } catch { /* transient network errors: keep the last known state */ }
  }, []);

  useEffect(() => {
    if (!enabled) {
      seen.current = null;
      setUnread(0);
      setItems([]);
      setToast(null);
      return undefined;
    }
    refresh();
    const timer = setInterval(() => { if (!document.hidden) refresh(); }, POLL_MS);
    const onVisible = () => { if (!document.hidden) refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled, refresh]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [toast]);

  const value = useMemo(() => ({ unread, items, toast, dismissToast: () => setToast(null), refresh }), [unread, items, toast, refresh]);
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}
