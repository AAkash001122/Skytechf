import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, Eye, Mail, MailOpen, Phone, Reply, Search, Trash2 } from 'lucide-react';
import { api } from './api';
import { useNotifications } from './NotificationsContext';
import ReplyModal from './ReplyModal';
import { cardClass, ConfirmDialog, fmtDate, ReplyBadge, Skeleton, StatusBadge } from './ui';

export { fmtDate };

const tabs = [['all', 'All'], ['unread', 'Unread'], ['read', 'Read']];
const cols = 'md:grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.6fr)_minmax(0,1.2fr)_9.5rem_11rem] md:items-center md:gap-4';
const iconBtn =
  'rounded-lg p-2 text-muted transition-all duration-200 hover:-translate-y-px hover:bg-white/8 hover:text-ink focus-visible:outline-primary';

function RowSkeleton() {
  return (
    <div className="space-y-2 px-5 py-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export default function Messages() {
  const { refresh } = useNotifications();
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setError('');
    api(`/messages?status=${status}&page=${page}&q=${encodeURIComponent(query)}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [status, page, query]);

  useEffect(() => {
    setData(null);
    load();
  }, [load]);

  async function toggleRead(m) {
    try {
      await api(`/messages/${m._id}/read`, { method: 'PATCH', body: { isRead: !m.isRead } });
      load();
      refresh();
    } catch (e) { setError(e.message); }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await api(`/messages/${toDelete._id}`, { method: 'DELETE' });
      setToDelete(null);
      load();
      refresh();
    } catch (e) {
      setError(e.message);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Contact messages</h1>
          <p className="mt-1 text-sm text-muted">{data ? `${data.total} shown, ${data.unread} unread in total` : 'Loading...'}</p>
        </div>
        <form role="search" onSubmit={(e) => { e.preventDefault(); setPage(1); setQuery(q.trim()); }} className="relative w-full sm:w-72">
          <Search aria-hidden="true" size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            aria-label="Search messages"
            placeholder="Search name, email, text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm transition-colors focus-visible:border-primary focus-visible:outline-primary"
          />
        </form>
      </div>

      <div className="mt-6 inline-flex rounded-xl border border-line bg-surface/60 p-1" role="tablist" aria-label="Filter messages">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={status === key}
            onClick={() => { setStatus(key); setPage(1); }}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${status === key ? 'bg-primary/15 text-primary' : 'text-muted hover:text-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-line bg-surface p-4 text-sm">
          <CircleAlert aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-primary-text" /> {error}
          <button type="button" onClick={load} className="ml-auto underline">Retry</button>
        </p>
      )}

      <div className={`${cardClass} mt-6 overflow-hidden`}>
        <div className={`hidden border-b border-line bg-white/3 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted ${cols}`}>
          <span>Sender</span><span>Message</span><span>Contact</span><span>Received</span><span className="text-right">Actions</span>
        </div>

        {!data && !error && [0, 1, 2, 3, 4].map((i) => <RowSkeleton key={i} />)}

        {data && data.items.length === 0 && <p className="px-5 py-14 text-center text-muted">No messages found.</p>}

        {data && data.items.length > 0 && (
          <ul className="divide-y divide-line">
            {data.items.map((m) => (
              <li
                key={m._id}
                className={`relative px-5 py-4 transition-colors duration-200 hover:bg-white/4 ${cols} ${m.isRead ? '' : 'bg-primary/5 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary'}`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!m.isRead && <span aria-label="Unread" className="size-2 shrink-0 rounded-full bg-primary" />}
                    <Link to={`/admin/messages/${m._id}`} className={`truncate hover:text-primary ${m.isRead ? 'text-ink/85' : 'font-semibold'}`}>{m.name}</Link>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-primary-text">{m.email}</p>
                </div>

                <div className="mt-2 min-w-0 md:mt-0">
                  <p className={`truncate text-sm ${m.isRead ? 'text-muted' : 'font-medium text-ink'}`}>{m.subject || `${m.projectType} enquiry`}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">{m.message}</p>
                </div>

                <div className="mt-2 min-w-0 text-sm text-muted md:mt-0">
                  {m.phone ? (
                    <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1.5 hover:text-primary"><Phone size={13} aria-hidden="true" /> {m.phone}</a>
                  ) : (
                    <span className="text-muted/60">No phone</span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 md:mt-0 md:block md:space-y-1.5">
                  <time dateTime={m.createdAt} className="block text-xs text-muted">{fmtDate(m.createdAt)}</time>
                  <div className="flex flex-wrap gap-1.5"><StatusBadge isRead={m.isRead} /><ReplyBadge status={m.replyStatus} /></div>
                </div>

                <div className="mt-3 flex items-center gap-0.5 md:mt-0 md:justify-end">
                  <Link to={`/admin/messages/${m._id}`} title="View" aria-label={`View message from ${m.name}`} className={iconBtn}><Eye size={16} aria-hidden="true" /></Link>
                  <button type="button" onClick={() => setReplyTo(m)} title="Reply via email" aria-label={`Reply to ${m.name}`} className={iconBtn}><Reply size={16} aria-hidden="true" /></button>
                  {m.phone && <a href={`tel:${m.phone}`} title="Call" aria-label={`Call ${m.name}`} className={iconBtn}><Phone size={16} aria-hidden="true" /></a>}
                  <button type="button" onClick={() => toggleRead(m)} title={m.isRead ? 'Mark as unread' : 'Mark as read'} aria-label={m.isRead ? 'Mark as unread' : 'Mark as read'} className={iconBtn}>
                    {m.isRead ? <Mail size={16} aria-hidden="true" /> : <MailOpen size={16} aria-hidden="true" />}
                  </button>
                  <button type="button" onClick={() => setToDelete(m)} title="Delete" aria-label={`Delete message from ${m.name}`} className={`${iconBtn} hover:text-red-300`}><Trash2 size={16} aria-hidden="true" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {data && data.pages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-xl border border-line px-4 py-2 transition-colors hover:bg-white/5 disabled:opacity-50">Previous</button>
          <span className="text-muted">Page {data.page} of {data.pages}</span>
          <button type="button" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="rounded-xl border border-line px-4 py-2 transition-colors hover:bg-white/5 disabled:opacity-50">Next</button>
        </div>
      )}

      <ReplyModal message={replyTo} open={Boolean(replyTo)} onClose={() => setReplyTo(null)} onSent={() => { load(); refresh(); }} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete message?"
        text={toDelete ? `The message from ${toDelete.name} and its replies will be permanently deleted.` : ''}
        busy={deleting}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
