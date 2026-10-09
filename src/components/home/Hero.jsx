import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { site } from '../../config/site';
import { Container } from '../Section';
import Button from '../Button';
import SectionBackdrop from '../SectionBackdrop';
import HeroVisual from './HeroVisual';

// A handful of glowing network nodes with data links, drawn faintly behind the hero.
const nodes = [[8, 18], [22, 62], [38, 30], [58, 12], [74, 44], [90, 20], [66, 78]];
const links = [[0, 2], [2, 3], [3, 5], [2, 4], [1, 2], [4, 6], [4, 5]];
function NetworkNodes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden opacity-40 sm:block">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {links.map(([x, y]) => (
          <line key={`${x}-${y}`} x1={nodes[x][0]} y1={nodes[x][1]} x2={nodes[y][0]} y2={nodes[y][1]} stroke="rgba(59,130,246,0.55)" strokeWidth="1" vectorEffect="non-scaling-stroke" className="dash-flow" />
        ))}
      </svg>
      {nodes.map(([x, y], i) => (
        <span
          key={i}
          className={`node-pulse absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${i % 4 === 0 ? 'bg-success shadow-[0_0_10px_var(--color-success)]' : 'bg-primary-text shadow-[0_0_10px_var(--color-blue)]'}`}
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * -0.5}s` }}
        />
      ))}
    </div>
  );
}

// Small twinkling stars echo the sparkles in the SkyTech logo.
const stars = [
  { x: '94%', y: '11%', size: 16, tone: 'text-primary' },
  { x: '52%', y: '5%', size: 10, tone: 'text-ink' },
  { x: '97%', y: '56%', size: 12, tone: 'text-ink' },
  { x: '78%', y: '90%', size: 10, tone: 'text-primary-text' },
];

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Hero() {
  const ref = useRef(null);

  // Lights up the background grid around the cursor (CSS variables, no re-render).
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--gx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      className="relative isolate overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20 lg:pt-24"
    >
      <SectionBackdrop variant="hero" />
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="grid-fade pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="grid-glow pointer-events-none absolute inset-0" />
      <NetworkNodes />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {stars.map((st, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={`twinkle absolute fill-current ${st.tone}`}
            style={{ left: st.x, top: st.y, width: st.size, height: st.size, animationDelay: `${i * -0.9}s` }}
          >
            <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
          </svg>
        ))}
      </div>

      <Container className="relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p
            variants={item}
            className="glass inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-1.5 text-sm text-ink/80"
          >
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            {site.status}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-balance text-[clamp(2.25rem,6.5vw,4.5rem)] font-bold leading-[1.05]"
          >
            We build web and software products that <span className="text-gradient">grow your business.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
            {site.valueProp}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to="/contact" className="px-7 py-3.5 text-base">
              Start Your Project <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button to="/portfolio" variant="secondary" className="px-7 py-3.5 text-base">View Our Work</Button>
          </motion.div>

          <motion.p variants={item} className="mt-8 text-sm text-muted">{site.trustLine}</motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          <div className="relative">
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 lg:block">
              <svg viewBox="0 0 400 400" className="h-full w-full opacity-70">
                <g className="orbit-spin" style={{ '--d': '70s', transformOrigin: '200px 200px' }}>
                  <circle cx="200" cy="200" r="192" fill="none" stroke="rgba(96,165,250,.28)" strokeWidth="1" strokeDasharray="2 9" />
                  <circle cx="200" cy="8" r="3.5" fill="#93C5FD" className="node-pulse" style={{ transformOrigin: '200px 8px' }} />
                </g>
                <g className="orbit-spin-rev" style={{ '--d': '48s', transformOrigin: '200px 200px' }}>
                  <circle cx="200" cy="200" r="158" fill="none" stroke="rgba(59,130,246,.35)" strokeWidth="1.2" strokeDasharray="50 20 6 20" />
                  <circle cx="358" cy="200" r="3" fill="#34D399" className="node-pulse" style={{ transformOrigin: '358px 200px' }} />
                </g>
              </svg>
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem]" style={{ background: 'radial-gradient(closest-side, color-mix(in srgb, var(--color-blue) 24%, transparent), transparent)' }} />
            <HeroVisual />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
