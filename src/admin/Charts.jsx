import { useState } from 'react';

/** Bars for the last N days. Hover/focus shows the exact count. SVG only; grows in once on mount. */
export function BarChart({ data }) {
  const [hover, setHover] = useState(null);
  const W = 560;
  const H = 190;
  const pad = { l: 28, r: 8, t: 14, b: 26 };
  const max = Math.max(3, ...data.map((d) => d.count));
  const bw = (W - pad.l - pad.r) / data.length;
  const y = (v) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const ticks = [0, Math.ceil(max / 2), max];
  const label = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' });

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Messages received per day, last 14 days" className="h-auto w-full">
        <defs>
          <linearGradient id="bar-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#60A5FA" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="rgba(148,163,184,.14)" strokeDasharray="3 5" />
            <text x={pad.l - 6} y={y(t) + 3} textAnchor="end" fontSize="9" fill="rgba(148,163,184,.8)">{t}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const h = Math.max(d.count ? 3 : 1.5, (H - pad.t - pad.b) * (d.count / max));
          const x = pad.l + i * bw + bw * 0.18;
          const w = bw * 0.64;
          const active = hover === i;
          return (
            <g key={d.date} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0} aria-label={`${label(d.date)}: ${d.count} messages`}>
              <rect x={pad.l + i * bw} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
              <rect
                x={x}
                y={H - pad.b - h}
                width={w}
                height={h}
                rx="3"
                fill={d.count ? 'url(#bar-g)' : 'rgba(148,163,184,.2)'}
                opacity={hover === null || active ? 1 : 0.55}
                className="bar-grow"
                style={{ animationDelay: `${i * 40}ms`, filter: active && d.count ? 'drop-shadow(0 0 6px rgba(59,130,246,.9))' : undefined, transition: 'opacity .15s' }}
              />
              {(i % 2 === 0 || i === data.length - 1) && (
                <text x={x + w / 2} y={H - 8} textAnchor="middle" fontSize="8.5" fill="rgba(148,163,184,.75)">{label(d.date)}</text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-lg border border-line bg-[#0A1122] px-2.5 py-1.5 text-xs shadow-lg"
          style={{ left: `${((pad.l + hover * bw + bw / 2) / W) * 100}%`, top: 0 }}
        >
          <span className="text-muted">{label(data[hover].date)}</span> <span className="font-semibold">{data[hover].count}</span>
        </div>
      )}
    </div>
  );
}

/** Donut of the inbox: unread, read but not replied, replied. */
export function Donut({ unread, replied, total }) {
  const awaiting = Math.max(0, total - unread - replied);
  const parts = [
    { label: 'Unread', value: unread, color: '#60A5FA' },
    { label: 'Read, no reply yet', value: awaiting, color: '#7C8DB5' },
    { label: 'Replied', value: replied, color: '#34D399' },
  ];
  const R = 52;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center xl:flex-col">
      <svg viewBox="0 0 140 140" role="img" aria-label={`Inbox status: ${unread} unread, ${awaiting} awaiting reply, ${replied} replied`} className="size-40 shrink-0">
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(148,163,184,.14)" strokeWidth="14" />
        {total > 0 && parts.map((p) => {
          const len = (p.value / total) * C;
          const el = (
            <circle
              key={p.label}
              cx="70" cy="70" r={R} fill="none" stroke={p.color} strokeWidth="14" strokeLinecap="butt"
              strokeDasharray={`${Math.max(0, len - 1.5)} ${C - Math.max(0, len - 1.5)}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
              style={{ filter: `drop-shadow(0 0 4px ${p.color}66)` }}
            />
          );
          offset += len;
          return el;
        })}
        <text x="70" y="68" textAnchor="middle" fontSize="24" fontWeight="700" fill="#F8FAFC">{total}</text>
        <text x="70" y="84" textAnchor="middle" fontSize="9" fill="rgba(148,163,184,.9)">messages</text>
      </svg>
      <ul className="space-y-2 text-sm">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-2.5">
            <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
            <span className="text-muted">{p.label}</span>
            <span className="ml-auto pl-4 font-semibold tabular-nums">{p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Tiny trend line for a stat card. */
export function Sparkline({ values, className = '' }) {
  const max = Math.max(1, ...values);
  const W = 120;
  const H = 32;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, H - 3 - (v / max) * (H - 8)]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className={`h-8 w-full ${className}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B82F6" stopOpacity=".35" />
          <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W} ${H} L0 ${H} Z`} fill="url(#spark-g)" />
      <path d={line} fill="none" stroke="#60A5FA" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
