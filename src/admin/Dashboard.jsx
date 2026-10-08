import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, Inbox, MailCheck, MailWarning } from 'lucide-react';
import { api } from './api';
import { useNotifications } from './NotificationsContext';
import { cardClass, Skeleton, timeAgo } from './ui';

const stats = [
  { key: 'total', label: 'Total messages', icon: Inbox },
  { key: 'unread', label: 'Unread', icon: MailWarning, accent: true },
  { key: 'replied', label: 'Replied', icon: MailCheck },
  { key: 'today', label: 'Received today', icon: CalendarClock },
];

export default function Dashboard() {
  const { unread, items } = useNotifications();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/stats').then(setData).catch((e) => setError(e.message));
  }, [unread]);

  return (
    <>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Overview of your contact inbox.</p>
      {error && <p role="alert" className="mt-6 rounded-xl border border-line bg-surface p-4 text-sm">{error}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ key, label, icon: Icon, accent }) => (
          <div key={key} className={`${cardClass} p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50`}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{label}</p>
              <span className={`rounded-lg p-2 ${accent ? 'bg-primary/15 text-primary' : 'bg-white/5 text-muted'}`}><Icon size={16} aria-hidden="true" /></span>
            </div>
            {data ? <p className="mt-3 text-3xl font-semibold tabular-nums">{data[key]}</p> : <Skeleton className="mt-4 h-8 w-16" />}
          </div>
        ))}
      </div>

      <section className={`${cardClass} mt-8 overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold">Latest unread</h2>
          <Link to="/admin/messages" className="group inline-flex items-center gap-1.5 text-sm text-primary">
            All messages <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        {items.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted">No unread messages.</p>
        ) : (
          <ul className="divide-y divide-line">
            {items.map((m) => (
              <li key={m._id}>
                <Link to={`/admin/messages/${m._id}`} className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/5">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate font-semibold">{m.name}</span>
                      <span className="shrink-0 text-xs text-muted">{timeAgo(m.createdAt)}</span>
                    </span>
                    <span className="block truncate text-xs text-primary-text">{m.email}</span>
                    <span className="mt-1 block truncate text-sm text-muted">{m.preview}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
