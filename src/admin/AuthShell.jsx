import { useEffect } from 'react';
import { CircleAlert, CircleCheck, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';

export const inputClass =
  'mt-2 w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-ink placeholder:text-muted/70 transition-colors focus-visible:border-primary focus-visible:outline-primary';
export const primaryBtn =
  'inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-bg shadow-md shadow-primary/20 transition-all hover:bg-primary/85 disabled:opacity-60';

/** Centered card on a glowing backdrop, shared by the admin login / forgot / reset pages. */
export default function AuthShell({ title, subtitle, children, footer }) {
  useEffect(() => {
    let meta = document.head.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent)' }}
      />
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-line bg-surface/80 p-7 shadow-2xl shadow-black/40 backdrop-blur sm:p-10">
          <div className="flex flex-col items-center text-center">
            <Logo sizeClass="h-14" />
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck size={13} aria-hidden="true" /> Admin area
            </span>
            <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
          </div>
          <div className="mt-8">{children}</div>
        </div>
        {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
      </div>
    </div>
  );
}

export function Notice({ kind = 'error', children }) {
  const Icon = kind === 'error' ? CircleAlert : CircleCheck;
  return (
    <p
      role={kind === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl border bg-bg p-3 text-sm ${kind === 'error' ? 'border-line' : 'border-success/50'}`}
    >
      <Icon aria-hidden="true" size={18} className={`mt-0.5 shrink-0 ${kind === 'error' ? 'text-primary-text' : 'text-success'}`} />
      <span>{children}</span>
    </p>
  );
}
