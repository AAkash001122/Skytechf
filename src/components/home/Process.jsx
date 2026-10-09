import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { site } from '../../config/site';
import useAutoAdvance from '../../hooks/useAutoAdvance';
import Section, { SectionHeading } from '../Section';
import Icon from '../Icon';
import Reveal from '../Reveal';

const steps = site.process;
const AUTOPLAY_MS = 5500;

/** Horizontal pipeline: a data packet travels the line to the active stage; details print in a terminal window. */
export default function Process() {
  const { active, select, playing, ref, hoverProps } = useAutoAdvance(steps.length, AUTOPLAY_MS);
  const tabs = useRef([]);
  const pct = (active / (steps.length - 1)) * 100;
  const step = steps[active];

  const go = (i) => {
    select(i);
    tabs.current[(i + steps.length) % steps.length]?.focus();
  };

  const onKeyDown = (e) => {
    if (['ArrowRight', 'ArrowDown'].includes(e.key)) { e.preventDefault(); go(active + 1); }
    if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); go(active - 1); }
  };

  return (
    <Section id="process" className="bright-bg border-y border-line" bg="flow">
      <SectionHeading
        eyebrow="How we work"
        title="A clear process from first call to launch"
        text="Six stages, no surprises. Follow the pipeline, or select a stage to see what happens and what you get."
        className="mx-auto text-center"
      />

      <div ref={ref} {...hoverProps}>
        <Reveal className="mx-auto mt-14 max-w-4xl">
          <div role="tablist" aria-label="Our process" onKeyDown={onKeyDown} className="relative">
            <div aria-hidden="true" className="absolute left-[22px] right-[22px] top-[22px] h-px bg-ink/15">
              <span className="data-flow absolute inset-0 opacity-30" />
              <motion.span
                className="absolute inset-y-0 left-0 h-px bg-gradient-to-r from-primary to-blue"
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <motion.span
                className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_3px] shadow-accent/35"
                initial={false}
                animate={{ left: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            </div>

            <div className="relative flex justify-between">
              {steps.map((s, i) => {
                const selected = i === active;
                const done = i < active;
                return (
                  <button
                    key={s.title}
                    ref={(el) => { tabs.current[i] = el; }}
                    type="button"
                    role="tab"
                    id={`step-tab-${i}`}
                    aria-selected={selected}
                    aria-controls="step-panel"
                    aria-label={s.title}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(i)}
                    className="group flex w-11 flex-col items-center sm:w-20"
                  >
                    <span
                      className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                        selected
                          ? 'scale-110 border-accent bg-accent/15 text-primary shadow-[0_0_24px_-4px] shadow-accent/35'
                          : done
                            ? 'border-primary/60 bg-primary/25 text-ink'
                            : 'card-bright border-ink/15 text-muted group-hover:border-accent/60 group-hover:text-ink'
                      }`}
                    >
                      {selected && <span aria-hidden="true" className="absolute inset-0 rounded-full border border-accent motion-safe:animate-ping" />}
                      {done ? <Check size={18} aria-hidden="true" /> : <Icon name={s.icon} size={18} />}
                    </span>
                    <span aria-hidden="true" className={`mt-3 hidden text-sm font-semibold transition-colors sm:block ${selected ? 'text-ink' : 'text-muted group-hover:text-ink'}`}>
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <div
            role="tabpanel"
            id="step-panel"
            aria-labelledby={`step-tab-${active}`}
            className="glass relative overflow-hidden rounded-2xl border border-ink/15 shadow-2xl shadow-bg/50"
          >
            {playing && (
              <motion.span
                key={`progress-${active}`}
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-primary to-blue"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
              />
            )}
            <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-3" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
              <span className="ml-3 font-mono text-xs text-muted">skytech / workflow</span>
            </div>

            <div className="min-h-[19rem] p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-mono text-sm text-muted"># Stage {active + 1} of {steps.length}</p>
                  <p className="mt-1 font-mono text-sm">
                    <span className="text-accent-text">$</span> skytech run <span className="text-primary-text">{step.title.toLowerCase()}</span>
                  </p>
                  <h3 className="mt-5 text-3xl font-bold">{step.title}</h3>
                  <p className="mt-2 max-w-xl text-muted">{step.text}</p>
                  <ul className="mt-5 space-y-2 font-mono text-sm">
                    {step.points.map((p, i) => (
                      <motion.li
                        key={p}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.12 }}
                        className="flex items-start gap-3"
                      >
                        <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-success" />{p}
                      </motion.li>
                    ))}
                    <li aria-hidden="true" className="flex items-center gap-3 text-muted">
                      <span className="text-accent-text">&gt;</span>
                      <span className="caret inline-block h-4 w-2 bg-accent" />
                    </li>
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between border-t border-ink/10 px-4 py-3">
              <button
                type="button"
                onClick={() => go(active - 1)}
                disabled={active === 0}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink disabled:opacity-40 disabled:hover:text-muted"
              >
                <ArrowLeft size={16} aria-hidden="true" /> Previous
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                disabled={active === steps.length - 1}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-bg transition-colors hover:bg-primary/85 disabled:opacity-40"
              >
                Next stage <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
