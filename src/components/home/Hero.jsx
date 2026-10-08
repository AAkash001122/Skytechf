import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { site } from '../../config/site';
import { Container } from '../Section';
import Button from '../Button';
import HeroVisual from './HeroVisual';

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
      className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20 lg:pt-24"
    >
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="grid-fade pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="grid-glow pointer-events-none absolute inset-0" />
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
          <HeroVisual />
        </motion.div>
      </Container>
    </section>
  );
}
