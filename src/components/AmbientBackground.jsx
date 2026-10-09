import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import BinaryRain from './welcome/BinaryRain';
import { CircuitBackdrop } from './welcome/WelcomeIntro';

/**
 * Site-wide background: slow glow orbs plus a light touch (~20%) of the welcome popup's tech look:
 * faint circuit traces with flowing data, and a few binary-digit columns drifting down the page margins only,
 * so they never sit behind body text. Transform/opacity animation only; the rain is desktop-only and skipped
 * when the visitor prefers reduced motion.
 */
export default function AmbientBackground() {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="orb-a absolute -left-[15%] top-[10%] h-[60vmax] w-[60vmax] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(closest-side, color-mix(in srgb, var(--color-blue) 14%, transparent), transparent)' }}
      />
      <div
        className="orb-b absolute -right-[20%] top-[45%] h-[55vmax] w-[55vmax] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(closest-side, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent)' }}
      />
      <CircuitBackdrop className="opacity-[0.12]" />
      {!reduce && wide && (
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{ maskImage: 'linear-gradient(90deg, #000 0%, transparent 22%, transparent 78%, #000 100%)', WebkitMaskImage: 'linear-gradient(90deg, #000 0%, transparent 22%, transparent 78%, #000 100%)' }}
        >
          <BinaryRain density={0.16} blueRatio={0.55} className="opacity-100" />
        </div>
      )}
    </div>
  );
}
