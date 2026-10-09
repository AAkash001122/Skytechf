import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Cloud, CreditCard, Database, Hexagon, MessageCircle, TrendingUp, Users } from 'lucide-react';
import Section, { SectionHeading } from '../Section';
import Reveal from '../Reveal';

// Illustrative simulation only: endpoints and numbers are not real client data.
const W = 800;
const H = 440;
const HUB = { x: 400, y: 230 };

const nodes = [
  { id: 'crm', name: 'CRM', Icon: Users, tone: 'text-primary', x: 400, y: 62, tag: 'POST /contacts', base: 31, depth: 10 },
  { id: 'erp', name: 'ERP', Icon: Database, tone: 'text-primary-text', x: 150, y: 132, tag: 'GET /inventory', base: 42, depth: 16 },
  { id: 'payments', name: 'Payments', Icon: CreditCard, tone: 'text-success', x: 650, y: 132, tag: 'POST /charges', base: 88, depth: 16 },
  { id: 'analytics', name: 'Analytics', Icon: TrendingUp, tone: 'text-primary', x: 165, y: 330, tag: 'GET /reports', base: 57, depth: 12 },
  { id: 'messaging', name: 'Messaging', Icon: MessageCircle, tone: 'text-primary-text', x: 635, y: 330, tag: 'POST /messages', base: 24, depth: 12 },
  { id: 'api', name: 'API / Services', Icon: Cloud, tone: 'text-ink', x: 400, y: 400, tag: 'GET /services', base: 18, depth: 8 },
].map((n, i) => {
  // Gentle curve from the hub to each node; alternate the bend so lines do not look mechanical.
  const mx = (HUB.x + n.x) / 2;
  const my = (HUB.y + n.y) / 2;
  const dx = n.x - HUB.x;
  const dy = n.y - HUB.y;
  const len = Math.hypot(dx, dy) || 1;
  const bend = (i % 2 ? 1 : -1) * 28;
  const cx = mx + (-dy / len) * bend;
  const cy = my + (dx / len) * bend;
  return { ...n, path: `M${HUB.x} ${HUB.y} Q${cx} ${cy} ${n.x} ${n.y}` };
});

const jitter = (base) => Math.max(8, Math.round(base + (Math.random() - 0.5) * base * 0.35));

function useLiveMetrics(live) {
  const [ms, setMs] = useState(() => Object.fromEntries(nodes.map((n) => [n.id, n.base])));
  const [events, setEvents] = useState(15864);

  useEffect(() => {
    if (!live) return undefined;
    const id = setInterval(() => {
      setMs(Object.fromEntries(nodes.map((n) => [n.id, jitter(n.base)])));
      setEvents(15000 + Math.round(Math.random() * 1800));
    }, 1400);
    return () => clearInterval(id);
  }, [live]);

  const avg = Math.round(Object.values(ms).reduce((a, b) => a + b, 0) / nodes.length);
  return { ms, events, avg };
}

function Tag({ node, ms, active }) {
  return (
    <span
      className={`absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border bg-bg/90 px-2 py-0.5 font-mono text-[9px] transition-colors sm:text-xs ${
        active ? 'border-accent/70 text-ink' : 'border-ink/15 text-ink/80'
      }`}
    >
      {node.tag} <span className="text-success">{ms}ms</span>
    </span>
  );
}

function NodeCard({ node, ms, active, onHover, px, py, index }) {
  const x = useTransform(px, [-0.5, 0.5], [-node.depth, node.depth]);
  const y = useTransform(py, [-0.5, 0.5], [-node.depth, node.depth]);
  const { Icon } = node;
  return (
    <motion.div
      style={{ x, y, left: `${(node.x / W) * 100}%`, top: `${(node.y / H) * 100}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <div className="float-y relative" style={{ animationDelay: `${index * -1.1}s` }}>
        <Tag node={node} ms={ms} active={active} />
        <div
          onMouseEnter={() => onHover(node.id)}
          onMouseLeave={() => onHover(null)}
          className={`glass flex items-center gap-2 rounded-xl border px-2.5 py-1.5 shadow-lg shadow-bg/40 transition-all duration-300 sm:gap-2.5 sm:px-3.5 sm:py-2.5 ${
            active ? 'border-accent/70 shadow-[0_0_30px_-6px] shadow-accent/35' : 'border-ink/15'
          }`}
        >
          <Icon size={18} aria-hidden="true" className={node.tone} />
          <span className="whitespace-nowrap text-[11px] font-semibold sm:text-sm">{node.name}</span>
        </div>
      </div>
    </motion.div>
  );
}

function Pill({ className, children }) {
  return (
    <div className={`glass absolute flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5 text-xs ${className}`}>
      {children}
    </div>
  );
}

function Diagram({ metrics, reduce }) {
  const [hovered, setHovered] = useState(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 90, damping: 20 });
  const spy = useSpring(py, { stiffness: 90, damping: 20 });

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { px.set(0); py.set(0); };

  return (
    <div
      aria-hidden="true"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto hidden w-full max-w-4xl sm:block"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
        {nodes.map((n) => {
          const on = hovered === n.id;
          return (
            <path
              key={n.id}
              id={`link-${n.id}`}
              d={n.path}
              fill="none"
              strokeLinecap="round"
              strokeWidth={on ? 2 : 1.25}
              className={`${on ? 'stroke-accent' : 'stroke-ink/25'} ${reduce ? '' : 'dash-flow'}`}
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
            />
          );
        })}
        {!reduce && nodes.map((n, i) => (
          [0, 1].map((dir) => {
            const dur = 3.4 + (i % 3) * 0.5;
            const begin = `-${(i * 0.7 + dir * 1.7).toFixed(1)}s`;
            return (
              <circle key={`${n.id}-${dir}`} r="3.5" className={dir ? 'fill-primary-text' : 'fill-accent'}>
                <animateMotion dur={`${dur}s`} begin={begin} repeatCount="indefinite" calcMode="linear" keyPoints={dir ? '1;0' : '0;1'} keyTimes="0;1">
                  <mpath href={`#link-${n.id}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />
              </circle>
            );
          })
        ))}
      </svg>

      {/* Hub */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${(HUB.x / W) * 100}%`, top: `${(HUB.y / H) * 100}%` }}
      >
        <span className="node-pulse absolute -inset-5 rounded-3xl border border-primary/50" />
        <span className="node-pulse absolute -inset-9 rounded-[2rem] border border-dashed border-accent/30" style={{ animationDelay: '-1.2s' }} />
        <div className="relative flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-2xl border border-primary/60 bg-surface shadow-[0_0_60px_-6px] shadow-primary/30 sm:h-24 sm:w-24">
          <Hexagon size={26} className="text-primary" />
          <span className="font-mono text-[11px] font-bold tracking-widest">HUB</span>
        </div>
      </div>

      {nodes.map((n, i) => (
        <NodeCard key={n.id} node={n} index={i} ms={metrics.ms[n.id]} active={hovered === n.id} onHover={setHovered} px={spx} py={spy} />
      ))}

      <Pill className="bottom-1 left-1">
        <span className="h-1.5 w-1.5 rounded-full bg-success motion-safe:animate-pulse" />
        <b className="font-semibold tabular-nums">{metrics.events.toLocaleString('en-IN')}</b>
        <span className="text-muted">events/min</span>
      </Pill>
      <Pill className="bottom-1 right-1">
        <span className="text-muted">avg response</span>
        <b className="font-semibold tabular-nums text-success">{metrics.avg}ms</b>
      </Pill>
    </div>
  );
}

/** Small-screen version: the same ecosystem as a compact grid feeding from the hub. */
function CompactList({ metrics }) {
  return (
    <div aria-hidden="true" className="sm:hidden">
      <div className="mx-auto flex w-fit flex-col items-center">
        <div className="relative flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-2xl border border-primary/60 bg-surface shadow-[0_0_50px_-6px] shadow-primary/30">
          <span className="node-pulse absolute -inset-3 rounded-3xl border border-primary/50" />
          <Hexagon size={24} className="text-primary" />
          <span className="font-mono text-[11px] font-bold tracking-widest">HUB</span>
        </div>
        <span className="data-flow mt-6 block h-px w-10 rotate-90 opacity-70" />
        <span className="h-4" />
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-3">
        {nodes.map((n, i) => (
          <li key={n.id} className="float-y glass rounded-xl border border-ink/15 p-3" style={{ animationDelay: `${i * -1}s` }}>
            <span className="flex items-center gap-2 text-sm font-semibold">
              <n.Icon size={16} className={n.tone} /> {n.name}
            </span>
            <span className="mt-2 block font-mono text-[10px] text-ink/80">{n.tag}</span>
            <span className="font-mono text-[10px] text-success">{metrics.ms[n.id]}ms</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-center gap-2 text-xs">
        <span className="glass flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success motion-safe:animate-pulse" />
          <b className="tabular-nums">{metrics.events.toLocaleString('en-IN')}</b> <span className="text-muted">events/min</span>
        </span>
      </div>
    </div>
  );
}

export default function SystemHub() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const reduce = useReducedMotion();
  const metrics = useLiveMetrics(inView && !reduce);

  return (
    <Section id="integrations" bg="network">
      <SectionHeading
        eyebrow="Connected systems"
        title="Software that connects your whole business"
        text="We build the CRM, payments, analytics and messaging pieces, then wire them together through clean, reliable APIs."
        className="mx-auto text-center"
      />
      <p className="sr-only">
        Illustration of a central hub connected to CRM, ERP, payments, analytics, messaging and API services.
      </p>
      <Reveal className="mt-14">
        <div ref={ref}>
          <Diagram metrics={metrics} reduce={reduce} />
          <CompactList metrics={metrics} />
        </div>
        <p className="mt-6 text-center text-xs text-muted">Simulated activity, shown for illustration.</p>
      </Reveal>
    </Section>
  );
}
