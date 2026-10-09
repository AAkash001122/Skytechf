import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Volume2, VolumeX, X } from 'lucide-react';
import logo from '../../assets/Skyteck.png';
import { playWelcome, setWelcomeMuted, stopWelcome } from '../../audio/audioManager';
import BinaryRain from './BinaryRain';
import TechScene from './TechScene';
import Terminal, { scriptBuild, scriptScan } from './Terminal';

const AUTO_CLOSE_MS = 10000;
const HEADING = ['WELCOME', 'TO', 'SKYTECK', 'WORLD'];
const ease = [0.22, 1, 0.36, 1];

const SNIPPETS = [
  { t: 'const app = await sky.deploy();', x: '4%', y: '14%', d: 0 },
  { t: 'SELECT * FROM leads WHERE new;', x: '70%', y: '9%', d: 1.2 },
  { t: 'ssh deploy@edge-01 -p 22', x: '6%', y: '78%', d: 2.1 },
  { t: '{ "status": "ok", "uptime": 99.99 }', x: '66%', y: '84%', d: 0.6 },
  { t: '0xFF3A  0x00B7  0x7E21', x: '40%', y: '4%', d: 1.7 },
];

/** Concentric rotating rings + orbiting nodes behind the logo (holographic feel). */
function HoloRings() {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 sm:h-104 sm:w-104">
      <g className="orbit-spin" style={{ '--d': '38s', transformOrigin: '200px 200px' }}>
        <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(96,165,250,0.35)" strokeWidth="1" strokeDasharray="2 10" />
        <circle cx="200" cy="10" r="4" fill="#93C5FD" className="node-pulse" style={{ transformOrigin: '200px 10px' }} />
      </g>
      <g className="orbit-spin-rev" style={{ '--d': '26s', transformOrigin: '200px 200px' }}>
        <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(59,130,246,0.45)" strokeWidth="1.2" strokeDasharray="60 22 6 22" />
        <circle cx="360" cy="200" r="3.5" fill="#4ADE80" className="node-pulse" style={{ transformOrigin: '360px 200px' }} />
      </g>
    </svg>
  );
}

/** Circuit traces with flowing data pulses across the whole overlay (stroke width stays 1px when stretched). */
export function CircuitBackdrop({ className = 'opacity-60' }) {
  const paths = [
    'M0 18 H22 L28 26 H55 L61 18 H100',
    'M0 62 H18 L24 54 H44 L50 62 H70',
    'M100 40 H80 L74 48 H58',
    'M100 82 H76 L70 74 H46 L40 82 H24 L18 90 H0',
    'M30 100 V86 L36 80 V62',
    'M72 0 V14 L66 20 V36',
  ];
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      {paths.map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke="rgba(59,130,246,0.22)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d={d} fill="none" stroke={i % 3 === 0 ? 'rgba(74,222,128,0.7)' : 'rgba(147,197,253,0.75)'} strokeWidth="1.2" vectorEffect="non-scaling-stroke" className="dash-flow" style={{ animationDuration: `${1.4 + i * 0.35}s` }} />
        </g>
      ))}
    </svg>
  );
}

function HudCorners() {
  const base = 'pointer-events-none absolute size-4 border-blue-300/80';
  return (
    <>
      <span aria-hidden="true" className={`${base} left-2.5 top-2.5 border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${base} right-2.5 top-2.5 border-r-2 border-t-2`} />
      <span aria-hidden="true" className={`${base} bottom-10 left-2.5 border-b-2 border-l-2`} />
      <span aria-hidden="true" className={`${base} bottom-10 right-2.5 border-b-2 border-r-2`} />
    </>
  );
}

/**
 * Welcome popup over the live homepage. `open` is controlled by the parent; onClose fires once the visitor
 * closes it, clicks Let's Explore, or the 10 second auto-close timer fires.
 */
export default function WelcomeIntro({ open, onClose }) {
  const reduce = useReducedMotion();
  const [blocked, setBlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const openedAt = useRef(null);
  // Anchor the 10 s to the first render of the open popup (not to when effects run), so it matches what the visitor sees.
  if (open && openedAt.current === null) openedAt.current = performance.now();

  const explore = useCallback(() => {
    playWelcome(); // no-op if already playing; if autoplay was blocked, this click is the gesture that starts it
    onClose();
  }, [onClose]);

  // Close / auto-close / Esc: dismiss and cut the sound if it is still playing.
  const dismiss = useCallback(() => {
    stopWelcome();
    onClose();
  }, [onClose]);

  // Lock page scroll while the popup is up.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prev; };
  }, [open]);

  // Exactly 10 s auto-close. The start time is kept in a ref so a Strict Mode remount resumes instead of restarting,
  // and the cleanup guarantees only one timer is ever pending.
  useEffect(() => {
    if (!open) {
      openedAt.current = null;
      return undefined;
    }
    const remaining = Math.max(0, AUTO_CLOSE_MS - (performance.now() - openedAt.current));
    const timer = setTimeout(dismiss, remaining);
    return () => clearTimeout(timer);
  }, [open, dismiss]);

  // Try to autoplay; if the browser blocks it, start on the first interaction (other than Close).
  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    let armed = false;
    const events = ['pointerdown', 'keydown', 'touchstart'];
    function disarm() {
      if (!armed) return;
      armed = false;
      events.forEach((ev) => window.removeEventListener(ev, onGesture, true));
      if (!cancelled) setBlocked(false);
    }
    function onGesture(e) {
      if (e.target?.closest?.('[data-close]') || e.key === 'Escape') return;
      playWelcome().then((ok) => { if (ok) disarm(); });
    }
    playWelcome().then((ok) => {
      if (cancelled || ok) return;
      setBlocked(true);
      armed = true;
      events.forEach((ev) => window.addEventListener(ev, onGesture, true));
    });
    const onKey = (e) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelled = true;
      armed = false;
      events.forEach((ev) => window.removeEventListener(ev, onGesture, true));
      window.removeEventListener('keydown', onKey);
    };
  }, [open, dismiss]);

  const toggleMute = () => {
    setMuted((m) => {
      setWelcomeMuted(!m);
      return !m;
    });
  };

  const rise = (delay) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.2 : 0.7, delay: reduce ? 0 : delay, ease },
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="welcome-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to SkyTeck World"
          className="fixed inset-0 z-100 overflow-hidden bg-[#050914]/72 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: reduce ? 0.15 : 0.5 } }}
          exit={{ opacity: 0, transition: { duration: reduce ? 0.15 : 0.6, ease: [0.4, 0, 0.2, 1] } }}
        >
          <div aria-hidden="true" className="absolute inset-0 opacity-70"><TechScene animate={!reduce} /></div>
          <CircuitBackdrop />
          <BinaryRain animate={!reduce} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(70% 70% at 50% 50%, transparent 35%, rgba(5,9,20,0.7) 100%)' }} />

          {SNIPPETS.map((s) => (
            <span
              key={s.t}
              aria-hidden="true"
              className="float-y pointer-events-none absolute hidden rounded border border-blue-400/20 bg-blue-500/5 px-2 py-1 font-mono text-[10px] text-blue-200/55 backdrop-blur-sm md:block"
              style={{ left: s.x, top: s.y, animationDelay: `${s.d}s` }}
            >
              {s.t}
            </span>
          ))}

          <div className="absolute inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 30, scale: reduce ? 1 : 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: reduce ? 0 : -12, scale: reduce ? 1 : 0.97 }}
                transition={{ duration: reduce ? 0.2 : 0.8, ease }}
                className="relative w-full max-w-xl"
              >
                {/* flanking live terminals, wide screens only */}
                <motion.div {...rise(0.9)} className="pointer-events-none absolute right-full top-1/2 mr-8 hidden w-80 -translate-y-1/2 xl:block">
                  <Terminal title="sky@lab: ~/skyteck — build" lines={scriptBuild} rows={8} animate={!reduce} />
                  <div className="mt-3 rounded-xl border border-blue-400/25 bg-[#06102A]/70 p-3 backdrop-blur-md" aria-hidden="true">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-blue-200/70">System load</p>
                    <div className="mt-2 flex h-10 items-end gap-1">
                      {[0.5, 0.8, 0.4, 0.95, 0.6, 0.75, 0.45, 0.9, 0.55, 0.7].map((v, i) => (
                        <span key={i} className="bar-pulse w-full rounded-sm bg-gradient-to-t from-blue-600 to-green-400/80" style={{ height: `${v * 100}%`, animationDelay: `${i * 0.18}s` }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
                <motion.div {...rise(1.1)} className="pointer-events-none absolute left-full top-1/2 ml-8 hidden w-80 -translate-y-1/2 xl:block">
                  <Terminal title="security-scan.sh — edge-01" lines={scriptScan} rows={8} animate={!reduce} />
                  <div className="mt-3 rounded-xl border border-blue-400/25 bg-[#06102A]/70 p-3 font-mono text-[10px] text-blue-200/70 backdrop-blur-md" aria-hidden="true">
                    <div className="flex justify-between"><span>FIREWALL</span><span className="text-green-300">ACTIVE</span></div>
                    <div className="mt-1 flex justify-between"><span>ENCRYPTION</span><span className="text-green-300">AES-256</span></div>
                    <div className="mt-1 flex justify-between"><span>THREATS</span><span className="text-green-300">0</span></div>
                  </div>
                </motion.div>

                <div className="relative overflow-hidden rounded-3xl border border-blue-300/25 bg-[#0B1530]/70 px-5 pb-0 pt-5 text-center shadow-[0_30px_120px_-20px_rgba(37,99,235,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl sm:px-10 sm:pt-6">
                  <HudCorners />
                  <div aria-hidden="true" className="scan-line pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-transparent via-blue-400/15 to-transparent" />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-blue-300/70 to-transparent" />

                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-blue-200/70">
                      <span aria-hidden="true" className="caret size-1.5 rounded-full bg-green-400" /> Sys online <span aria-hidden="true" className="hidden sm:inline">// secure link</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleMute}
                        aria-label={muted ? 'Unmute welcome sound' : 'Mute welcome sound'}
                        className="rounded-full border border-white/15 bg-white/5 p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        {muted ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}
                      </button>
                      <button
                        type="button"
                        data-close
                        onClick={dismiss}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:border-white/50 hover:bg-white/20"
                      >
                        <X size={14} aria-hidden="true" /> Close
                      </button>
                    </div>
                  </div>

                  <div className="relative mx-auto mt-1 flex h-36 items-center justify-center sm:h-44" style={{ perspective: 800 }}>
                    <HoloRings />
                    <div aria-hidden="true" className="absolute h-28 w-52 rounded-full bg-blue-500/30 blur-3xl" />
                    <motion.div
                      initial={{ opacity: 0, rotateY: reduce ? 0 : -100, scale: reduce ? 1 : 0.55 }}
                      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                      transition={{ duration: reduce ? 0.2 : 1.2, delay: reduce ? 0 : 0.2, ease }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <motion.img
                        src={logo}
                        alt="SkyTeck"
                        width="642"
                        height="264"
                        decoding="async"
                        fetchPriority="high"
                        className="relative h-20 w-auto select-none rounded-2xl ring-1 ring-blue-300/30 drop-shadow-[0_0_22px_rgba(59,130,246,0.65)] sm:h-24"
                        animate={reduce ? undefined : { rotateY: [-9, 9, -9], y: [0, -5, 0] }}
                        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
                      />
                    </motion.div>
                  </div>

                  <h1 className="relative mt-2 font-display text-[1.55rem] font-bold leading-[1.15] tracking-[0.04em] text-white sm:text-4xl">
                    {HEADING.map((word, i) => (
                      <Fragment key={word}>
                        {i > 0 && ' '}
                        <motion.span
                          className={`inline-block ${word === 'SKYTECK' ? 'glitch bg-linear-to-r from-blue-300 via-white to-blue-300 bg-clip-text text-transparent' : ''}`}
                          {...rise(0.6 + i * 0.1)}
                        >
                          {word}
                        </motion.span>
                      </Fragment>
                    ))}
                  </h1>

                  <motion.p className="relative mt-3 text-base italic text-blue-100/80 sm:text-lg" {...rise(1.05)}>
                    Innovating Today, Building Tomorrow.
                  </motion.p>

                  <motion.div {...rise(1.2)} className="relative mt-5 xl:hidden">
                    <Terminal title="sky@lab: ~/skyteck" lines={scriptBuild} rows={5} animate={!reduce} className="text-left" />
                  </motion.div>

                  <motion.div className="relative mt-6 flex flex-col items-center gap-3" {...rise(1.3)}>
                    <button
                      type="button"
                      onClick={explore}
                      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-linear-to-r from-blue-600 to-blue-500 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_40px_-6px_rgba(37,99,235,0.9)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_60px_-4px_rgba(59,130,246,1)] focus-visible:outline-white"
                    >
                      <span aria-hidden="true" className="welcome-shine absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30" />
                      <span className="relative">LET&apos;S EXPLORE</span>
                      <ArrowRight size={18} aria-hidden="true" className="relative transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                    {blocked && !muted && (
                      <p className="text-xs text-blue-100/60" role="status">Tap anywhere or press Let&apos;s Explore to start the welcome sound.</p>
                    )}
                  </motion.div>

                  <div aria-hidden="true" className="relative -mx-5 mt-6 overflow-hidden border-t border-blue-400/20 bg-blue-500/5 py-1.5 sm:-mx-10">
                    <div className="marquee flex w-max whitespace-nowrap font-mono text-[10px] tracking-[0.3em] text-green-400/60">
                      {[0, 1].map((n) => (
                        <span key={n} className="pr-8">01001000 01000101 01001100 01001100 01001111 00100000 01010111 01001111 01010010 01001100 01000100 00100000 10110010 01101001 11010011 00101110 </span>
                      ))}
                    </div>
                  </div>
                  <div aria-hidden="true" className="-mx-5 h-0.5 bg-blue-950 sm:-mx-10">
                    <div className="countdown h-full bg-linear-to-r from-blue-500 to-green-400" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
