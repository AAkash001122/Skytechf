import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ExternalLink, Inbox, KeyRound, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationsContext';
import { timeAgo } from './ui';
import Logo from '../components/Logo';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/messages', label: 'Contact messages', icon: Inbox, badge: true },
  { to: '/admin/change-password', label: 'Change password', icon: KeyRound },
];

function Sidebar({ onNavigate }) {
  const { unread } = useNotifications();
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-2 pt-5"><Logo sizeClass="h-11" /></div>
      <p className="px-6 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-widest text-muted/80">Manage</p>
      <nav aria-label="Admin" className="flex-1 space-y-1 px-3">
        {nav.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive ? 'bg-primary/10 text-primary shadow-[inset_2px_0_0_var(--color-primary)]' : 'text-muted hover:translate-x-0.5 hover:bg-white/5 hover:text-ink'
              }`
            }
          >
            <Icon size={18} aria-hidden="true" />
            <span className="flex-1">{label}</span>
            {badge && unread > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-bg">{unread > 99 ? '99+' : unread}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-3">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-ink">
          <ExternalLink size={18} aria-hidden="true" /> View website
        </Link>
      </div>
    </div>
  );
}

/** Single bell used by both the navbar and the footer; both read the same NotificationsContext. */
function NotificationBell({ up = false }) {
  const { unread, items } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (to) => { setOpen(false); navigate(to); };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative rounded-xl border border-line p-2.5 text-ink/90 transition-all hover:border-accent/60 hover:bg-white/5"
        data-notification-bell={up ? 'footer' : 'navbar'}
      >
        <Bell size={18} aria-hidden="true" />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key={unread}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold leading-5 text-bg"
            >
              {unread > 99 ? '99+' : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: up ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: up ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/50 ${up ? 'bottom-full mb-2 origin-bottom-right' : 'mt-2 origin-top-right'}`}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-sm font-semibold">New contact messages</p>
              <span className="text-xs text-muted">{unread} unread</span>
            </div>
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted">You are all caught up.</p>
            ) : (
              <ul className="max-h-96 divide-y divide-line overflow-y-auto">
                {items.map((n) => (
                  <li key={n._id}>
                    <button type="button" onClick={() => go(`/admin/messages/${n._id}`)} className="block w-full px-4 py-3 text-left transition-colors hover:bg-white/5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="size-2 shrink-0 rounded-full bg-primary" />
                          <span className="truncate text-sm font-semibold">{n.name}</span>
                        </span>
                        <span className="shrink-0 text-[11px] text-muted">{timeAgo(n.createdAt)}</span>
                      </div>
                      <p className="mt-0.5 truncate pl-4 text-xs text-primary-text">{n.email}</p>
                      <p className="mt-1 line-clamp-2 pl-4 text-xs text-muted">&ldquo;{n.preview}&rdquo;</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" onClick={() => go('/admin/messages')} className="w-full border-t border-line px-4 py-3 text-center text-sm font-medium text-primary transition-colors hover:bg-white/5">
              View all messages
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminFooter() {
  const { unread } = useNotifications();
  return (
    <footer className="mt-auto border-t border-line bg-surface/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <p className="text-xs text-muted">&copy; {new Date().getFullYear()} SkyTech Admin Panel</p>
        <div className="flex items-center gap-4">
          <Link to="/admin/messages" className="text-xs text-muted transition-colors hover:text-ink">
            {unread > 0 ? `${unread} unread message${unread === 1 ? '' : 's'}` : 'No new messages'}
          </Link>
        </div>
      </div>
    </footer>
  );
}

function Toast() {
  const { toast, dismissToast } = useNotifications();
  const navigate = useNavigate();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 w-[min(22rem,calc(100vw-2rem))]" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="pointer-events-auto rounded-2xl border border-accent/50 bg-surface p-4 shadow-2xl shadow-black/50"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-lg bg-primary/15 p-2 text-primary"><Bell size={16} aria-hidden="true" /></span>
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => { dismissToast(); navigate(`/admin/messages/${toast._id}`); }}>
                <p className="text-sm font-semibold">New contact message</p>
                <p className="truncate text-sm">{toast.name}</p>
                <p className="truncate text-xs text-primary-text">{toast.email}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted">&ldquo;{toast.preview}&rdquo;</p>
              </button>
              <button type="button" onClick={dismissToast} aria-label="Dismiss" className="text-muted hover:text-ink"><X size={16} aria-hidden="true" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Shell() {
  const { admin, logout } = useAuth();
  const { pathname } = useLocation();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => { setDrawer(false); }, [pathname]);

  return (
    <div className="min-h-screen bg-bg">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-surface/60 backdrop-blur lg:block">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div className="absolute inset-0 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.aside
              className="absolute inset-y-0 left-0 w-72 border-r border-line bg-surface"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Sidebar onNavigate={() => setDrawer(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-bg/80 px-4 py-3 backdrop-blur sm:px-6">
          <button type="button" onClick={() => setDrawer(true)} aria-label="Open menu" className="rounded-xl border border-line p-2.5 hover:bg-white/5 lg:hidden">
            <Menu size={18} aria-hidden="true" />
          </button>
          <p className="hidden text-sm text-muted lg:block">Admin panel</p>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <span className="hidden max-w-[14rem] truncate text-sm text-muted md:inline">{admin.email}</span>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2.5 text-sm font-medium transition-all hover:border-accent/60 hover:bg-white/5">
              <LogOut size={16} aria-hidden="true" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
            <Outlet />
          </motion.div>
        </main>
        <AdminFooter />
      </div>
      <Toast />
    </div>
  );
}

/** Guards every /admin page except login. */
export default function AdminLayout() {
  const { admin, checking } = useAuth();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Admin | SkyTech';
    let meta = document.head.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';
  }, []);

  if (checking) return <div className="min-h-screen" aria-busy="true" />;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <Shell />;
}
