import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Check, Rocket } from 'lucide-react';

const codeLines = [
  [['text-primary-text', 'const '], ['text-ink', 'product = '], ['text-primary-text', 'await '], ['text-ink', 'skytech.'], ['text-accent-text', 'build'], ['text-ink', '({']],
  [['text-muted', '  design: '], ['text-accent-text', "'approved'"], ['text-ink', ',']],
  [['text-muted', '  tests: '], ['text-accent-text', "'passing'"], ['text-ink', ',']],
  [['text-muted', '  launch: '], ['text-accent-text', "'on time'"], ['text-ink', ',']],
  [['text-ink', '});']],
];

const bars = [0.5, 0.8, 0.6, 1, 0.7, 0.9, 0.55, 0.85, 0.65, 0.95];

function Chip({ className, delay, children }) {
  return (
    <div className={`float-y glass absolute flex items-center gap-2 rounded-full border border-ink/15 px-3.5 py-2 text-xs font-semibold shadow-xl shadow-bg/40 ${className}`} style={{ animationDelay: delay }}>
      {children}
    </div>
  );
}

/** Decorative "product UI" that types, pulses and tilts toward the cursor. */
export default function HeroVisual() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 });

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
      className="relative mx-auto w-full max-w-md py-10 [perspective:1100px] lg:max-w-none"
    >
      <motion.div style={reduce ? undefined : { rotateX, rotateY }} className="relative [transform-style:preserve-3d]">
        <div className="glass overflow-hidden rounded-3xl border border-ink/15 shadow-2xl shadow-primary/25">
          <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
            <span className="ml-3 font-mono text-xs text-muted">launch.js</span>
          </div>
          <pre className="overflow-hidden px-5 py-5 font-mono text-[13px] leading-7 sm:text-sm">
            {codeLines.map((line, i) => (
              <div key={i} className="type-line whitespace-pre" style={{ animationDelay: `${0.6 + i * 0.7}s` }}>
                {line.map(([cls, text], j) => <span key={j} className={cls}>{text}</span>)}
                {i === codeLines.length - 1 && <span className="caret ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-accent" />}
              </div>
            ))}
          </pre>
          <div className="border-t border-ink/10 px-5 pb-5 pt-4">
            <div className="mb-3 flex items-center justify-between text-xs text-muted">
              <span>Build activity</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Live</span>
            </div>
            <div className="flex h-16 items-end gap-1.5">
              {bars.map((h, i) => (
                <span
                  key={i}
                  className="bar-pulse flex-1 rounded-t bg-gradient-to-t from-primary to-blue"
                  style={{ height: `${h * 100}%`, animationDelay: `${i * 0.22}s`, animationDuration: `${2 + (i % 4) * 0.4}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        <Chip className="-right-2 top-1 sm:-right-6" delay="0s">
          <Check size={14} aria-hidden="true" className="text-success" /> Tests passing
        </Chip>
        <Chip className="-left-3 bottom-2 sm:-left-8" delay="-3s">
          <Rocket size={14} aria-hidden="true" className="text-primary" /> Deployed to production
        </Chip>
      </motion.div>
    </div>
  );
}
