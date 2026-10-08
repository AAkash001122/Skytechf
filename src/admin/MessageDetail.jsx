import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CircleAlert, Mail, MailOpen, Phone, Reply, Trash2 } from 'lucide-react';
import { api } from './api';
import { useNotifications } from './NotificationsContext';
import ReplyModal from './ReplyModal';
import { btnDanger, btnGhost, btnPrimary, cardClass, ConfirmDialog, fmtDate, ReplyBadge, Skeleton, StatusBadge } from './ui';

export default function MessageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refresh } = useNotifications();
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState('');
  const [replyOpen, setReplyOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Opening a message marks it read in MongoDB, then the bell count is re-synced from the server.
  useEffect(() => {
    let live = true;
    setMsg(null);
    (async () => {
      try {
        const d = await api(`/messages/${id}`);
        if (!live) return;
        setMsg(d.message);
        if (!d.message.isRead) {
          const r = await api(`/messages/${id}/read`, { method: 'PATCH', body: { isRead: true } });
          if (live) setMsg(r.message);
          refresh();
        }
      } catch (e) {
        if (live) setError(e.message);
      }
    })();
    return () => { live = false; };
  }, [id, refresh]);

  async function reload() {
    try {
      const d = await api(`/messages/${id}`);
      setMsg(d.message);
    } catch (e) { setError(e.message); }
    refresh();
  }

  async function toggleRead() {
    try {
      const r = await api(`/messages/${id}/read`, { method: 'PATCH', body: { isRead: !msg.isRead } });
      setMsg(r.message);
      refresh();
    } catch (e) { setError(e.message); }
  }

  async function remove() {
    setDeleting(true);
    try {
      await api(`/messages/${id}`, { method: 'DELETE' });
      refresh();
      navigate('/admin/messages', { replace: true });
    } catch (e) {
      setError(e.message);
      setConfirmDel(false);
      setDeleting(false);
    }
  }

  const back = (
    <Link to="/admin/messages" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
      <ArrowLeft size={16} aria-hidden="true" /> All messages
    </Link>
  );

  if (error && !msg) {
    return (
      <>
        {back}
        <p role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-line bg-surface p-4 text-sm">
          <CircleAlert aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-primary-text" /> {error}
        </p>
      </>
    );
  }
  if (!msg) {
    return (
      <>
        {back}
        <Skeleton className="mt-6 h-8 w-1/2" />
        <div className={`${cardClass} mt-6 space-y-3 p-6`}>
          <Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-1/4" /><Skeleton className="h-20 w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      {back}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold sm:text-3xl">{msg.subject || `${msg.projectType} enquiry`}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2"><StatusBadge isRead={msg.isRead} /><ReplyBadge status={msg.replyStatus} /></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setReplyOpen(true)} className={btnPrimary}><Reply size={16} aria-hidden="true" /> Reply via email</button>
          {msg.phone && <a href={`tel:${msg.phone}`} className={btnGhost}><Phone size={16} aria-hidden="true" /> Call</a>}
          <button type="button" onClick={toggleRead} className={btnGhost}>
            {msg.isRead ? <><Mail size={16} aria-hidden="true" /> Mark unread</> : <><MailOpen size={16} aria-hidden="true" /> Mark read</>}
          </button>
          <button type="button" onClick={() => setConfirmDel(true)} className={btnDanger}><Trash2 size={16} aria-hidden="true" /> Delete</button>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl border border-line bg-surface p-3 text-sm">{error}</p>}

      <section aria-label="Conversation" className="mt-6 space-y-4">
        <article className={`${cardClass} p-5 sm:p-6`}>
          <header className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-semibold">{msg.name}</p>
            <time dateTime={msg.createdAt} className="text-xs text-muted">{fmtDate(msg.createdAt)}</time>
          </header>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-xs uppercase tracking-wide text-muted">Email</dt><dd><a href={`mailto:${msg.email}`} className="break-all text-primary-text hover:underline">{msg.email}</a></dd></div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">Phone</dt>
              <dd>{msg.phone ? <a href={`tel:${msg.phone}`} className="inline-flex items-center gap-1.5 hover:text-primary"><Phone size={14} aria-hidden="true" /> {msg.phone}</a> : <span className="text-muted">Not provided</span>}</dd>
            </div>
            <div><dt className="text-xs uppercase tracking-wide text-muted">Project type</dt><dd>{msg.projectType}</dd></div>
            {msg.budget && <div><dt className="text-xs uppercase tracking-wide text-muted">Budget</dt><dd>{msg.budget}</dd></div>}
          </dl>
          <p className="mt-5 whitespace-pre-wrap wrap-break-word border-t border-line pt-5">{msg.message}</p>
        </article>

        {msg.replies.map((r) => (
          <article key={r._id} className="rounded-2xl border border-accent/40 bg-primary/5 p-5 sm:ml-10 sm:p-6">
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">You <span className="font-normal text-muted">({r.sentBy})</span></p>
              <span className="text-xs text-muted">
                <time dateTime={r.sentAt}>{fmtDate(r.sentAt)}</time>{' - '}
                <span className={r.status === 'sent' ? 'text-success' : 'text-red-300'}>{r.status === 'sent' ? 'Emailed' : 'Not delivered'}</span>
              </span>
            </header>
            {r.subject && <p className="mt-2 text-xs text-muted">Subject: {r.subject}</p>}
            <p className="mt-3 whitespace-pre-wrap wrap-break-word">{r.body}</p>
            {r.status === 'failed' && r.error && <p className="mt-2 text-xs text-muted">Error: {r.error}</p>}
          </article>
        ))}
      </section>

      <ReplyModal message={msg} open={replyOpen} onClose={() => setReplyOpen(false)} onSent={reload} />
      <ConfirmDialog open={confirmDel} title="Delete message?" text="This message and its replies will be permanently deleted." busy={deleting} onConfirm={remove} onClose={() => setConfirmDel(false)} />
    </>
  );
}
