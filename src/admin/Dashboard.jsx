import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Terminal from '../components/welcome/Terminal';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, Inbox, MailCheck, MailWarning } from 'lucide-react';
import { api } from './api';
import { useNotifications } from './NotificationsContext';
import { BarChart, Donut, Sparkline } from './Charts';
import { cardClass, Skeleton, timeAgo } from './ui';

const stats = [
  { key: 'total', label: 'Total messages', icon: Inbox },
  { key: 'unread', label: 'Unread', icon: MailWarning, accent: true },
  { key: 'replied', label: 'Replied', icon: MailCheck },
  { key: 'today', label: 'Received today', icon: CalendarClock },
];

export default function Dashboard() {
  const { unread, items } = useNotifications();
  const reduce = useReducedMotion();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Control-center terminal: the status lines only appear because the API calls above really succeeded.
  const lines = useMemo(() => (data ? [
    { t: 'cmd', s: 'skytech status --admin' },
    { t: 'out', s: 'api ............ ok', c: 'text-green-300' },
    { t: 'out', s: 'database ....... ok', c: 'text-green-300' },
    { t: 'out', s: 'audio storage .. gridfs' },
    { t: 'cmd', s: 'skytech inbox --summary' },
    { t: 'out', s: `total=${data.total} unread=${data.unread} replied=${data.replied} today=${data.today}`, c: 'text-blue-300' },
    { t: 'cmd', s: 'tail -f activity.log' },
    { t: 'out', s: 'watching for new messages...' },
  ] : null), [data]);

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
            {key === 'total' && data?.daily && <Sparkline values={data.daily.map((d) => d.count)} className="mt-2" />}
          </div>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className={`${cardClass} p-5`} aria-label="Messages per day">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages, last 14 days</h2>
            <span className="text-xs text-muted">UTC days</span>
          </div>
          {data?.daily ? <BarChart data={data.daily} /> : <Skeleton className="h-48 w-full" />}
        </section>
        <section className={`${cardClass} p-5`} aria-label="Inbox status">
          <h2 className="mb-4 text-lg font-semibold">Inbox status</h2>
          {data ? <Donut unread={data.unread} replied={data.replied} total={data.total} /> : <Skeleton className="h-44 w-full" />}
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <section className={`${cardClass} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold">Latest unread</h2>
          <Link to="/admin/messages" className="group inline-flex items-center gap-1.5 text-sm text-primary">
            All messages <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        {items.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <span className="rounded-2xl bg-success/10 p-3 text-success"><MailCheck size={22} aria-hidden="true" /></span>
            <p className="mt-3 font-semibold">You are all caught up</p>
            <p className="mt-1 text-sm text-muted">No unread messages right now.</p>
          </div>
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
      <aside aria-label="Control center" className="self-start">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted"><span aria-hidden="true" className="text-success/70">/ </span>Control center</h2>
          <span className="flex items-center gap-1.5 text-xs text-muted"><span aria-hidden="true" className="size-1.5 rounded-full bg-success" /> live</span>
        </div>
        {lines ? <Terminal title="skytech-control: ~" lines={lines} rows={10} animate={!reduce} /> : <Skeleton className="h-72 w-full" />}
      </aside>
      </div>
    </>
  );
}
