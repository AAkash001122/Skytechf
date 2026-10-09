import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export const fmtDate = (d) =>
  new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export function timeAgo(d) {
  const s = Math.max(1, Math.round((Date.now() - new Date(d)) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

export const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60';
export const btnGhost = `${btnBase} border border-line px-3.5 py-2 text-ink/90 hover:-translate-y-px hover:border-accent/60 hover:bg-white/5`;
export const btnPrimary = `${btnBase} bg-primary px-4 py-2.5 font-semibold text-bg shadow-md shadow-primary/20 hover:-translate-y-px hover:bg-primary/85`;
export const btnDanger = `${btnBase} border border-line px-3.5 py-2 text-ink/90 hover:-translate-y-px hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-300`;
export const cardClass = 'rounded-2xl border border-line bg-surface/70 shadow-lg shadow-black/20';

export function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-white/6 ${className}`} />;
}

export function StatusBadge({ isRead }) {
  return isRead ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">Read</span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
      <span className="size-1.5 rounded-full bg-primary" /> Unread
    </span>
  );
}

export function ReplyBadge({ status }) {
  if (status === 'sent') return <span className="rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 text-xs text-success">Replied</span>;
  if (status === 'failed') return <span className="rounded-full border border-red-400/40 bg-red-500/10 px-2.5 py-0.5 text-xs text-red-300">Reply failed</span>;
  return null;
}

/** Accessible modal: Esc and backdrop close it, scroll is locked while open. */
export function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            className="absolute inset-0 bg-black/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-line bg-surface p-5 shadow-2xl sm:rounded-3xl sm:p-7 ${wide ? 'max-w-2xl' : 'max-w-md'}`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-ink">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({ open, title, text, confirmLabel = 'Delete', busy, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted">{text}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
        <button type="button" onClick={onConfirm} disabled={busy} className={`${btnBase} bg-red-500/90 px-4 py-2.5 font-semibold text-white hover:bg-red-500`}>
          {busy ? 'Working...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
