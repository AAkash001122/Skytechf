import { useEffect, useState } from 'react';
import { CircleAlert, LoaderCircle, Send } from 'lucide-react';
import { api } from './api';
import { useAuth } from './AuthContext';
import { btnGhost, btnPrimary, Modal } from './ui';

const field =
  'mt-1.5 w-full rounded-xl border border-line bg-bg/60 px-4 py-2.5 text-ink placeholder:text-muted/70 transition-colors focus-visible:border-primary focus-visible:outline-primary';

/** Emails a reply to the sender through the backend (SMTP credentials never reach the browser). */
export default function ReplyModal({ message, open, onClose, onSent }) {
  const { admin } = useAuth();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open && message) {
      setSubject(`Re: ${message.subject || 'Contact Form Inquiry'}`);
      setBody('');
      setError('');
    }
  }, [open, message]);

  async function send(e) {
    e.preventDefault();
    if (body.trim().length < 2) return setError('Write a reply first.');
    setError('');
    setBusy(true);
    try {
      const r = await api(`/messages/${message._id}/reply`, { method: 'POST', body: { subject, body } });
      onSent?.(r.message);
      onClose();
    } catch (err) {
      setError(err.message);
      onSent?.(null); // a failed delivery is still saved to history, so let the parent refresh
    } finally {
      setBusy(false);
    }
  }

  if (!message) return null;
  return (
    <Modal open={open} onClose={onClose} title="Reply via email" wide>
      <form onSubmit={send} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">From</label>
            <p className="mt-1.5 truncate rounded-xl border border-line bg-bg/40 px-4 py-2.5 text-sm text-ink/80">{admin?.mailFrom || admin?.email}</p>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">To</label>
            <p className="mt-1.5 truncate rounded-xl border border-line bg-bg/40 px-4 py-2.5 text-sm text-ink/80">{message.email}</p>
          </div>
        </div>
        <div>
          <label htmlFor="reply-subject" className="block text-xs font-medium uppercase tracking-wide text-muted">Subject</label>
          <input id="reply-subject" value={subject} maxLength={200} onChange={(e) => setSubject(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="reply-body" className="block text-xs font-medium uppercase tracking-wide text-muted">Message</label>
          <textarea id="reply-body" rows={7} maxLength={5000} autoFocus value={body} onChange={(e) => setBody(e.target.value)} placeholder={`Hi ${message.name.split(' ')[0]},`} className={field} />
        </div>
        <blockquote className="max-h-28 overflow-y-auto rounded-xl border-l-2 border-accent/60 bg-bg/40 px-4 py-3 text-xs text-muted">
          <span className="font-medium text-ink/70">Original message:</span> {message.message}
        </blockquote>
        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm">
            <CircleAlert size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-red-300" /> {error}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
          <button type="submit" disabled={busy} className={btnPrimary}>
            {busy ? (<><LoaderCircle size={16} aria-hidden="true" className="motion-safe:animate-spin" /> Sending...</>) : (<><Send size={16} aria-hidden="true" /> Send reply</>)}
          </button>
        </div>
      </form>
    </Modal>
  );
}
