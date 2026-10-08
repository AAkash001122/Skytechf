import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { site } from '../../config/site';
import useAutoAdvance from '../../hooks/useAutoAdvance';
import Icon from '../Icon';
import Reveal from '../Reveal';

const services = site.services;
const RADIUS = 37; // percent of the square diagram

const nodes = services.map((_, i) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / services.length;
  return { x: 50 + RADIUS * Math.cos(angle), y: 50 + RADIUS * Math.sin(angle) };
});

/** Hub-and-spoke diagram: SkyTech in the middle, one node per service, data pulsing along the active link. */
export default function ServicesNetwork() {
  const { active, select, playing, ref, hoverProps } = useAutoAdvance(services.length, 4500);
  const current = services[active];

  return (
    <Reveal>
      <div ref={ref} {...hoverProps} className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="relative mx-auto aspect-square w-full max-w-[540px]">
          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
            <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="0.25" className="stroke-ink/15" strokeDasharray="1 2" />
            <circle cx="50" cy="50" r="18" fill="none" strokeWidth="0.25" className="stroke-primary/40" />
            <g className="orbit-spin" style={{ transformOrigin: '50px 50px', '--d': '30s' }}>
              <circle cx="50" cy={50 - RADIUS} r="0.9" className="fill-primary" />
            </g>
            <motion.circle
              key={`pulse-${active}`}
              r="1.1"
              className="fill-primary"
              initial={{ cx: 50, cy: 50, opacity: 1 }}
              animate={{ cx: nodes[active].x, cy: nodes[active].y, opacity: [1, 1, 0] }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
            {nodes.map((n, i) => (
              <line
                key={i}
                x1="50" y1="50" x2={n.x} y2={n.y}
                strokeWidth={i === active ? 0.6 : 0.25}
                strokeLinecap="round"
                className={i === active ? 'dash-flow stroke-accent' : 'stroke-ink/20'}
                style={{ transition: 'stroke-width 0.3s' }}
              />
            ))}
          </svg>

          <div className="absolute left-1/2 top-1/2 flex h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-primary/50 bg-surface text-center shadow-[0_0_60px_-10px] shadow-primary/30">
            <span aria-hidden="true" className="node-pulse absolute inset-0 rounded-full border border-accent/40" />
            <span className="font-display text-sm font-bold sm:text-lg">SkyTech</span>
            <span className="hidden text-[10px] uppercase tracking-widest text-muted sm:block">Services</span>
          </div>

          {services.map((s, i) => {
            const selected = i === active;
            return (
              <button
                key={s.title}
                type="button"
                aria-pressed={selected}
                aria-label={s.title}
                onClick={() => select(i)}
                style={{ left: `${nodes[i].x}%`, top: `${nodes[i].y}%` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
              >
                {selected && (
                  <span aria-hidden="true" className="node-pulse absolute inset-0 rounded-2xl border border-primary/50" />
                )}
                <span
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 sm:h-14 sm:w-14 ${
                    selected
                      ? 'scale-110 border-accent bg-accent/15 text-primary shadow-[0_0_24px_-4px] shadow-accent/35'
                      : 'card-bright border-ink/15 text-primary group-hover:-translate-y-1 group-hover:scale-110 group-hover:border-accent/60 group-hover:shadow-[0_8px_24px_-8px] group-hover:shadow-accent/50'
                  }`}
                >
                  <Icon name={s.icon} size={22} />
                </span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-1/2 top-full mt-2 hidden w-28 -translate-x-1/2 text-center text-xs font-medium leading-tight transition-colors md:block ${
                    selected ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        <div aria-live="polite" className="card-bright relative min-h-[22rem] overflow-hidden rounded-3xl border border-ink/10 p-7 sm:p-9">
          {playing && (
            <motion.span
              key={`bar-${active}`}
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-primary to-blue"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 4.5, ease: 'linear' }}
            />
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <p className="font-mono text-xs uppercase tracking-widest text-accent-text">
                Service {String(active + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
              </p>
              <h3 className="mt-3 text-3xl font-bold">{current.title}</h3>
              <p className="mt-3 text-muted">{current.text}</p>
              <ul className="mt-6 space-y-3">
                {current.points.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.08 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-success" />{p}
                  </motion.li>
                ))}
              </ul>
              <Link to="/contact" className="group/link mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-text">
                Get a quote for this
                <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover/link:translate-x-1" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Reveal>
  );
}
