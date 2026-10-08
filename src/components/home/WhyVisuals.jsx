import { Check, ShieldCheck } from 'lucide-react';

// Small decorative loops. All are aria-hidden and use transform/opacity only.

function Sprint() {
  const rows = [
    { label: 'Design', delay: '0s' },
    { label: 'Build', delay: '0.5s' },
    { label: 'Demo', delay: '1s' },
  ];
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3 text-xs text-muted">
          <span className="w-12 font-mono">{r.label}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
            <span className="fill-bar block h-full rounded-full bg-gradient-to-r from-primary to-blue" style={{ animationDelay: r.delay }} />
          </span>
          <Check size={14} className="fill-bar text-success" style={{ animationDelay: r.delay }} />
        </div>
      ))}
    </div>
  );
}

function Chat() {
  return (
    <div className="space-y-2.5 text-xs">
      <div className="bubble w-fit max-w-[80%] rounded-2xl rounded-bl-sm bg-ink/10 px-3 py-2">Can we add reports?</div>
      <div className="bubble ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-bg" style={{ animationDelay: '1.2s' }}>
        Yes, ready for Friday&apos;s demo.
      </div>
      <div className="bubble w-fit rounded-2xl rounded-bl-sm bg-ink/10 px-3 py-2" style={{ animationDelay: '2.4s' }}>Perfect, thanks!</div>
    </div>
  );
}

function Layers() {
  const blocks = ['from-primary to-blue', 'from-primary/80 to-blue/80', 'from-primary/60 to-blue/60', 'from-primary/40 to-blue/40'];
  return (
    <div className="mx-auto flex max-w-[15rem] flex-col gap-1.5">
      {blocks.map((b, i) => (
        <div
          key={b}
          className={`stack-block h-6 rounded-lg bg-gradient-to-r ${b}`}
          style={{ animationDelay: `${(blocks.length - 1 - i) * 0.35}s`, width: `${100 - i * 8}%`, marginInline: 'auto' }}
        />
      ))}
    </div>
  );
}

function Pulse() {
  return (
    <div className="flex items-center gap-4">
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/15 text-success">
        <ShieldCheck size={22} />
        <span className="absolute inset-0 rounded-2xl border border-success/40 motion-safe:animate-ping" />
      </span>
      <svg viewBox="0 0 120 40" className="h-10 flex-1 overflow-visible" fill="none">
        <path d="M0 22H30L38 6L48 36L56 14L62 22H120" pathLength="1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="heartbeat stroke-accent" />
      </svg>
      <span className="font-mono text-xs text-success">monitoring</span>
    </div>
  );
}

const visuals = { Zap: Sprint, MessagesSquare: Chat, Blocks: Layers, ShieldCheck: Pulse };

export default function WhyVisual({ icon }) {
  const Cmp = visuals[icon];
  return (
    <div aria-hidden="true" className="flex min-h-36 items-center rounded-2xl border border-ink/10 bg-bg/40 p-5">
      <div className="w-full">{Cmp && <Cmp />}</div>
    </div>
  );
}
