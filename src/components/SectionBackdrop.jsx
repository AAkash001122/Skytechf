import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Terminal, { scriptBuild, scriptCloud, scriptScan, scriptSecurity } from './welcome/Terminal';

/**
 * Animated, IT-inspired section backgrounds (one `variant` per landing section).
 *
 *   hero    perspective grid floor, drifting binary digits, light particles, soft sweeping light
 *   nodes   connected network nodes with flowing data lines                   (About)
 *   glow    soft pulsing light behind card grids                              (Services)
 *   tech    floating code/technology tokens                                   (Technologies)
 *   geo     slow geometric outlines with angled gradient lighting             (Why SkyTeck)
 *   flow    workflow lines with data packets travelling along them            (How we work)
 *   grid    perspective digital grid with gentle particles                    (Career)
 *   network glowing network connections along the edges                       (Contact)
 *
 * Cyber/cloud layers mixed into the variants: Streams (data falling), ScanBeam, CloudDiagram (cloud + servers with
 * data packets), Radar (security sweep), TerminalPanel (holographic live terminal, mounted only while on screen).
 *
 * Everything is CSS/SVG transform+opacity animation (compositor friendly). Counts shrink on small screens, the
 * parallax and SMIL motion switch off for reduced-motion, and the layer fades out at its top/bottom edges so
 * neighbouring sections blend without seams. It is purely decorative: aria-hidden and pointer-events-none.
 */

const rnd = (n) => { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); }; // deterministic: no flicker between renders

function useWide() {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

/** A layer that moves slightly against the scroll to create depth. depth=0 renders a plain static layer. */
function Layer({ progress, depth, className = '', children }) {
  const y = useTransform(progress, [0, 1], [-depth, depth]);
  if (!depth) return <div className={`absolute inset-0 ${className}`}>{children}</div>;
  return <motion.div style={{ y }} className={`absolute inset-0 ${className}`}>{children}</motion.div>;
}

function Dots({ n, seed = 1, wide }) {
  const count = wide ? n : Math.ceil(n / 3);
  return Array.from({ length: count }, (_, i) => {
    const size = 2 + rnd(seed + i * 3) * 2.5;
    const green = rnd(seed + i * 7) > 0.88;
    return (
      <span
        key={i}
        className={`p-drift absolute rounded-full ${green ? 'bg-success/70' : 'bg-blue-300/60'}`}
        style={{ left: `${rnd(seed + i) * 100}%`, top: `${rnd(seed + i * 5) * 100}%`, width: size, height: size, boxShadow: `0 0 ${size * 4}px ${green ? 'rgba(52,211,153,.5)' : 'rgba(96,165,250,.6)'}`, '--dur': `${16 + rnd(seed + i * 11) * 18}s`, '--delay': `${-rnd(seed + i * 13) * 20}s` }}
      />
    );
  });
}

function Digits({ n, seed = 1, wide }) {
  const count = wide ? n : Math.ceil(n / 3);
  return Array.from({ length: count }, (_, i) => {
    const len = 1 + Math.floor(rnd(seed + i * 17) * 6);
    const text = Array.from({ length: len }, (__, k) => (rnd(seed + i * 19 + k) > 0.5 ? '1' : '0')).join('');
    const green = rnd(seed + i * 23) > 0.8;
    return (
      <span
        key={i}
        className={`drift-up absolute font-mono text-[11px] tracking-widest ${green ? 'text-success/60' : 'text-blue-300/50'}`}
        style={{ left: `${rnd(seed + i * 2) * 100}%`, top: `${40 + rnd(seed + i * 4) * 60}%`, '--dur': `${26 + rnd(seed + i * 29) * 24}s`, '--delay': `${-rnd(seed + i * 31) * 40}s` }}
      >
        {text}
      </span>
    );
  });
}

const TOKENS = ['</>', '{ }', 'npm', 'git', 'API', 'JSON', '0x1F', 'SQL', 'async', '=>', 'docker', 'React', 'Node', 'AWS', 'TS'];
function CodeTokens({ wide }) {
  const list = wide ? TOKENS : TOKENS.slice(0, 5);
  return list.map((t, i) => (
    <span
      key={t}
      className="drift-up absolute rounded-md border border-blue-400/15 bg-blue-500/5 px-2 py-0.5 font-mono text-[11px] text-blue-200/35"
      style={{ left: i % 4 === 0 ? `${1 + rnd(i + 3) * 5}%` : `${58 + rnd(i * 5 + 2) * 38}%`, top: `${45 + rnd(i * 3 + 9) * 55}%`, '--dur': `${30 + rnd(i + 40) * 30}s`, '--delay': `${-rnd(i + 70) * 50}s` }}
    >
      {t}
    </span>
  ));
}

/** Perspective grid; the inner plane slides one cell per loop so it looks like flying forward (transform only). */
function GridFloor({ className = '' }) {
  return (
    <div className={`absolute inset-x-[-20%] bottom-0 h-[55%] overflow-hidden ${className}`} style={{ perspective: '520px', maskImage: 'linear-gradient(to top, #000 15%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to top, #000 15%, transparent 95%)' }}>
      <div className="absolute inset-0 origin-bottom" style={{ transform: 'rotateX(58deg)' }}>
        <div
          className="grid-slide absolute inset-x-0 -top-14 bottom-0"
          style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,.38) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.38) 1px, transparent 1px)', backgroundSize: '56px 56px' }}
        />
      </div>
    </div>
  );
}

function Glow({ className, tone = 'blue', pulse = false }) {
  const c = tone === 'navy' ? 'rgba(30,64,175,.30)' : tone === 'sky' ? 'rgba(96,165,250,.16)' : 'rgba(37,99,235,.22)';
  return <div className={`absolute rounded-full ${pulse ? 'pulse-glow' : ''} ${className}`} style={{ background: `radial-gradient(closest-side, ${c}, transparent)` }} />;
}

function NodeNet({ nodes, links }) {
  return (
    <>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {links.map(([a, b], i) => (
          <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="rgba(59,130,246,.5)" strokeWidth="1" vectorEffect="non-scaling-stroke" className="dash-flow" style={{ animationDuration: `${1.8 + (i % 4) * 0.5}s` }} />
        ))}
      </svg>
      {nodes.map(([x, y], i) => (
        <span
          key={i}
          className={`node-pulse absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${i % 5 === 0 ? 'bg-success shadow-[0_0_10px_var(--color-success)]' : 'bg-blue-300 shadow-[0_0_10px_var(--color-blue)]'}`}
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * -0.45}s` }}
        />
      ))}
    </>
  );
}

const NODES_ABOUT = [[6, 24], [16, 70], [28, 40], [42, 16], [58, 58], [72, 28], [86, 66], [94, 20], [50, 86]];
const LINKS_ABOUT = [[0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [5, 7], [4, 6], [5, 6], [4, 8]];
const NODES_CONTACT = [[4, 18], [10, 52], [6, 82], [20, 34], [24, 70], [96, 14], [90, 48], [94, 80], [78, 30], [74, 66]];
const LINKS_CONTACT = [[0, 3], [1, 3], [1, 4], [2, 4], [3, 4], [5, 8], [6, 8], [6, 9], [7, 9], [8, 9]];

const wave = 'M0 100 C 150 40, 300 160, 450 100 S 750 40, 900 100 S 1050 160, 1200 100';
const wave2 = 'M0 140 C 200 90, 380 190, 600 140 S 1000 90, 1200 140';

function Flow({ animateMotion }) {
  return (
    <svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <path id="flow-a" d={wave} />
        <path id="flow-b" d={wave2} />
      </defs>
      <use href="#flow-a" fill="none" stroke="rgba(59,130,246,.22)" strokeWidth="1.2" />
      <use href="#flow-a" fill="none" stroke="rgba(147,197,253,.55)" strokeWidth="1.2" className="dash-flow" />
      <use href="#flow-b" fill="none" stroke="rgba(59,130,246,.16)" strokeWidth="1" />
      <use href="#flow-b" fill="none" stroke="rgba(52,211,153,.35)" strokeWidth="1" className="dash-flow" style={{ animationDuration: '2.4s' }} />
      {animateMotion &&
        [['a', 0, '#93C5FD', 14], ['a', -7, '#60A5FA', 14], ['b', -3, '#34D399', 18]].map(([p, begin, fill, dur], i) => (
          <circle key={i} r="3.2" fill={fill} style={{ filter: `drop-shadow(0 0 5px ${fill})` }}>
            <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite"><mpath href={`#flow-${p}`} /></animateMotion>
          </circle>
        ))}
    </svg>
  );
}

function Geo() {
  return (
    <>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #60A5FA 0 1px, transparent 1px 38px)' }} />
      <div className="absolute -right-24 top-6 size-80 opacity-60"><div className="orbit-spin size-full border border-blue-400/20" style={{ '--d': '90s', transform: 'rotate(45deg)' }} /></div>
      <div className="absolute -left-20 bottom-10 size-72 opacity-60"><div className="orbit-spin-rev size-full border border-blue-400/15" style={{ '--d': '120s' }} /></div>
      <div className="absolute left-1/3 top-1/4 size-40 opacity-40"><div className="orbit-spin size-full rounded-3xl border border-success/15" style={{ '--d': '150s', transform: 'rotate(20deg)' }} /></div>
      <div className="sweep absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(96,165,250,.08), transparent)' }} />
    </>
  );
}


/** Thin data streams falling through the section (container-relative via 100cqh). */
function Streams({ n, seed = 1, wide }) {
  const count = wide ? n : Math.ceil(n / 3);
  return Array.from({ length: count }, (_, i) => (
    <span
      key={i}
      className="stream-fall absolute top-0 h-28 w-px motion-reduce:hidden"
      style={{ left: `${3 + rnd(seed + i * 6) * 94}%`, background: i % 5 === 0 ? 'linear-gradient(transparent, rgba(52,211,153,.55))' : 'linear-gradient(transparent, rgba(96,165,250,.5))', '--dur': `${9 + rnd(seed + i * 9) * 10}s`, '--delay': `${-rnd(seed + i * 14) * 14}s` }}
    />
  ));
}

/** A soft horizontal scanning beam that travels down the section. */
function ScanBeam() {
  return (
    <div className="scan-sweep absolute inset-x-0 top-0 h-28 motion-reduce:hidden" style={{ background: 'linear-gradient(to bottom, transparent, rgba(96,165,250,.10) 85%, rgba(147,197,253,.28) 100%)', borderBottom: '1px solid rgba(147,197,253,.25)' }} />
  );
}

/** Cloud with three servers underneath; dashed links carry data and (when motion is allowed) packets travel along them. */
export function CloudDiagram({ idp, animateMotion, className }) {
  const links = [['M160 100 L70 150', 'a'], ['M160 100 L160 150', 'b'], ['M160 100 L250 150', 'c']];
  return (
    <svg viewBox="0 0 320 210" className={`absolute ${className}`} fill="none">
      <path d="M96 104 C62 104 62 62 96 60 C98 28 142 22 158 48 C180 30 218 46 212 76 C246 78 246 104 212 104 Z" stroke="rgba(147,197,253,.75)" strokeWidth="1.4" fill="rgba(37,99,235,.10)" />
      <text x="160" y="84" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="rgba(191,219,254,.8)">CLOUD</text>
      {links.map(([d, k]) => (
        <g key={k}>
          <path id={`${idp}-${k}`} d={d} stroke="rgba(59,130,246,.35)" strokeWidth="1.2" />
          <path d={d} stroke="rgba(147,197,253,.8)" strokeWidth="1.2" className="dash-flow" />
        </g>
      ))}
      {[40, 130, 220].map((x, i) => (
        <g key={x}>
          <rect x={x} y="150" width="60" height="42" rx="6" stroke="rgba(147,197,253,.6)" strokeWidth="1.2" fill="rgba(6,16,42,.55)" />
          <line x1={x + 8} y1="164" x2={x + 40} y2="164" stroke="rgba(96,165,250,.5)" />
          <line x1={x + 8} y1="174" x2={x + 30} y2="174" stroke="rgba(96,165,250,.35)" />
          <circle cx={x + 50} cy="164" r="2.6" fill={i === 1 ? '#34D399' : '#60A5FA'} className="node-pulse" style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: `${i * -0.7}s` }} />
        </g>
      ))}
      {animateMotion && links.map(([, k], i) => (
        <circle key={k} r="2.8" fill={i === 1 ? '#34D399' : '#93C5FD'}>
          <animateMotion dur={`${3.2 + i * 0.7}s`} begin={`${-i}s`} repeatCount="indefinite"><mpath href={`#${idp}-${k}`} /></animateMotion>
        </circle>
      ))}
    </svg>
  );
}

/** Security radar: rings, crosshair, a rotating sweep and pinging blips around a shield. */
export function Radar({ className }) {
  return (
    <div className={`absolute ${className}`}>
      {['inset-0', 'inset-[16%]', 'inset-[32%]', 'inset-[46%]'].map((r) => <span key={r} className={`absolute ${r} rounded-full border border-blue-400/25`} />)}
      <span className="absolute left-1/2 top-0 h-full w-px bg-blue-400/15" />
      <span className="absolute left-0 top-1/2 h-px w-full bg-blue-400/15" />
      <span className="radar-spin absolute inset-0 rounded-full motion-reduce:hidden" style={{ background: 'conic-gradient(from 0deg, rgba(52,211,153,.30), rgba(52,211,153,0) 22%)' }} />
      {[[70, 28], [24, 62], [58, 76]].map(([x, y], i) => (
        <span key={i} className="node-pulse absolute size-1.5 rounded-full bg-success shadow-[0_0_10px_var(--color-success)]" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * -0.8}s` }} />
      ))}
      <ShieldCheck className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 text-blue-200/70" aria-hidden="true" />
    </div>
  );
}

const SCRIPTS = { build: scriptBuild, cloud: scriptCloud, scan: scriptScan, security: scriptSecurity };
/** Holographic terminal. Only mounted while its section is on screen, so off-screen sections cost nothing. */
function TerminalPanel({ script, title, active, reduce, className }) {
  if (!active) return null;
  return (
    <div className={`float-y absolute ${className}`}>
      <div className="relative overflow-hidden rounded-xl">
        <Terminal title={title} lines={SCRIPTS[script]} rows={7} animate={!reduce} />
        <span className="scan-line pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent via-blue-400/15 to-transparent motion-reduce:hidden" />
      </div>
    </div>
  );
}

export default function SectionBackdrop({ variant }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const wide = useWide();
  const inView = useInView(ref, { margin: '120px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const px = !reduce && wide; // parallax only where it is cheap and welcome
  const d = (n) => (px ? n : 0);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ containerType: 'size', maskImage: 'linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)' }}
    >
      {variant === 'hero' && (
        <>
          <Glow className="orb-a -left-24 top-0 size-[44rem]" tone="navy" />
          <Glow className="orb-b -right-32 top-1/3 size-[40rem]" />
          <Layer progress={scrollYProgress} depth={d(26)}><GridFloor /></Layer>
          <Layer progress={scrollYProgress} depth={d(46)}><Dots n={30} seed={11} wide={wide} /></Layer>
          <Layer progress={scrollYProgress} depth={d(70)}><Digits n={16} seed={5} wide={wide} /></Layer>
          <Streams n={9} seed={3} wide={wide} />
          <ScanBeam />
          <div className="sweep absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(96,165,250,.07), transparent)' }} />
        </>
      )}
      {variant === 'nodes' && (
        <>
          <Glow className="orb-a -right-32 -top-24 size-[36rem]" />
          <Layer progress={scrollYProgress} depth={d(24)}><div className="absolute inset-0 opacity-45"><NodeNet nodes={NODES_ABOUT} links={LINKS_ABOUT} /></div></Layer>
          <Layer progress={scrollYProgress} depth={d(40)}><Dots n={12} seed={21} wide={wide} /></Layer>
          <Layer progress={scrollYProgress} depth={d(16)}><TerminalPanel script="security" title="secops@skytech: ~" active={inView && wide} reduce={reduce} className="right-[3%] top-[14%] hidden w-80 opacity-70 xl:block" /></Layer>
        </>
      )}
      {variant === 'glow' && (
        <>
          <Glow className="pulse-glow left-[8%] top-[12%] size-[34rem]" />
          <Glow className="pulse-glow right-[4%] bottom-[8%] size-[30rem]" tone="navy" />
          <Glow className="orb-b left-1/3 top-1/3 size-[28rem]" tone="sky" />
          <div className="dot-grid absolute inset-0 opacity-[0.22]" />
          <Layer progress={scrollYProgress} depth={d(30)}><Dots n={10} seed={31} wide={wide} /></Layer>
          <Layer progress={scrollYProgress} depth={d(18)}><CloudDiagram idp="cs" animateMotion={!reduce} className="right-[2%] top-[2%] hidden w-[26rem] opacity-30 lg:block" /></Layer>
          <Streams n={5} seed={8} wide={wide} />
        </>
      )}
      {variant === 'tech' && (
        <>
          <Glow className="orb-b right-0 top-0 size-[34rem]" tone="navy" />
          <Glow className="orb-a -left-24 bottom-0 size-[30rem]" tone="sky" />
          <Layer progress={scrollYProgress} depth={d(34)}><CodeTokens wide={wide} /></Layer>
          <Layer progress={scrollYProgress} depth={d(18)}><Dots n={14} seed={41} wide={wide} /></Layer>
          <Layer progress={scrollYProgress} depth={d(26)}><CloudDiagram idp="ct" animateMotion={!reduce} className="-left-6 bottom-[2%] hidden w-80 opacity-25 lg:block" /></Layer>
          <ScanBeam />
        </>
      )}
      {variant === 'geo' && (
        <>
          <Glow className="orb-a left-[10%] top-[-6rem] size-[34rem]" />
          <Glow className="orb-b right-[6%] bottom-[-8rem] size-[32rem]" tone="navy" />
          <Layer progress={scrollYProgress} depth={d(28)}><Geo /></Layer>
          <Layer progress={scrollYProgress} depth={d(20)}><Radar className="-right-10 bottom-[4%] hidden size-72 opacity-40 lg:block" /></Layer>
        </>
      )}
      {variant === 'flow' && (
        <>
          <Glow className="pulse-glow left-1/2 top-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2" tone="navy" />
          <Layer progress={scrollYProgress} depth={d(20)}><div className="absolute inset-x-0 bottom-0 h-[60%] opacity-55"><Flow animateMotion={!reduce} /></div></Layer>
          <Layer progress={scrollYProgress} depth={d(36)}><Dots n={8} seed={51} wide={wide} /></Layer>
          <Layer progress={scrollYProgress} depth={d(14)}><TerminalPanel script="cloud" title="deploy@cloud: ~" active={inView && wide} reduce={reduce} className="-left-4 top-[8%] hidden w-72 opacity-45 2xl:block" /></Layer>
        </>
      )}
      {variant === 'grid' && (
        <>
          <Glow className="orb-a left-1/4 -top-20 size-[34rem]" />
          <Layer progress={scrollYProgress} depth={d(22)}><GridFloor /></Layer>
          <Layer progress={scrollYProgress} depth={d(44)}><Dots n={22} seed={61} wide={wide} /></Layer>
          <Layer progress={scrollYProgress} depth={d(14)}><TerminalPanel script="build" title="sky@lab: ~/careers" active={inView && wide} reduce={reduce} className="right-[4%] top-[16%] hidden w-80 opacity-70 xl:block" /></Layer>
        </>
      )}
      {variant === 'network' && (
        <>
          <Glow className="orb-a -left-24 top-1/4 size-[32rem]" />
          <Glow className="orb-b -right-24 bottom-0 size-[30rem]" tone="navy" />
          <Layer progress={scrollYProgress} depth={d(24)}><div className="absolute inset-0 opacity-50"><NodeNet nodes={NODES_CONTACT} links={LINKS_CONTACT} /></div></Layer>
          <Layer progress={scrollYProgress} depth={d(40)}><Dots n={10} seed={71} wide={wide} /></Layer>
          <Layer progress={scrollYProgress} depth={d(18)}><Radar className="-left-12 bottom-[6%] hidden size-64 opacity-35 lg:block" /></Layer>
          <Streams n={6} seed={12} wide={wide} />
        </>
      )}
    </div>
  );
}
