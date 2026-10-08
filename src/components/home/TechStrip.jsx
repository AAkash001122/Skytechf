import { useState } from 'react';
import { site } from '../../config/site';
import { Container } from '../Section';
import Reveal from '../Reveal';
import TechIcon from '../TechIcon';

const groups = site.techGroups;
const all = groups.flatMap((g) => g.items.map((item) => ({ ...item, category: g.title })));
const byCategory = (...names) => all.filter((t) => names.includes(t.category));

// Two counter-rotating rings. `radius` is a fraction of the diagram size.
const rings = [
  { items: byCategory('Backend', 'Databases'), radius: 0.27, duration: '48s', reverse: true },
  { items: byCategory('Frontend', 'Cloud and DevOps'), radius: 0.44, duration: '70s', reverse: false },
];

function Orbit({ onHover }) {
  return (
    <div
      className="orbit-wrap relative mx-auto aspect-square"
      style={{ '--s': 'min(78vw, 540px)', width: 'var(--s)' }}
    >
      {rings.map((ring) => {
        const size = `calc(var(--s) * ${ring.radius * 2})`;
        const spin = ring.reverse ? 'orbit-spin-rev' : 'orbit-spin';
        const counter = ring.reverse ? 'orbit-counter-rev' : 'orbit-counter';
        return (
          <ul
            key={ring.radius}
            className={`${spin} absolute list-none rounded-full border border-dashed border-ink/20`}
            style={{ '--d': ring.duration, width: size, height: size, left: `calc(50% - ${size} / 2)`, top: `calc(50% - ${size} / 2)` }}
          >
            {ring.items.map((t, i) => {
              const angle = (360 / ring.items.length) * i;
              return (
                <li
                  key={t.name}
                  className="absolute left-1/2 top-1/2 h-0 w-0"
                  style={{ transform: `rotate(${angle}deg) translateX(calc(var(--s) * ${ring.radius}))` }}
                >
                  <div style={{ transform: `rotate(${-angle}deg)` }}>
                    <div className={`${counter} h-0 w-0`} style={{ '--d': ring.duration }}>
                      <button
                        type="button"
                        onMouseEnter={() => onHover(t)}
                        onMouseLeave={() => onHover(null)}
                        onFocus={() => onHover(t)}
                        onBlur={() => onHover(null)}
                        aria-label={`${t.name}, ${t.category}`}
                        className="group card-bright flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-ink/15 text-ink/85 shadow-lg shadow-bg/40 transition-all duration-300 hover:scale-125 hover:border-accent hover:text-primary hover:shadow-[0_0_28px_-2px] hover:shadow-accent/35 sm:h-14 sm:w-14"
                      >
                        <TechIcon slug={t.slug} size={26} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        );
      })}
    </div>
  );
}

export default function TechStrip() {
  const [hovered, setHovered] = useState(null);

  return (
    <section aria-labelledby="tech-heading" className="bright-bg overflow-hidden border-y border-line py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Our stack</p>
              <h2 id="tech-heading" className="mt-3 text-balance text-3xl font-bold sm:text-4xl md:text-5xl">
                Technologies we <span className="text-gradient">build with</span>
              </h2>
              <p className="mt-4 text-lg text-muted">
                Proven, modern tools chosen to keep your product fast, secure and easy to grow.
              </p>
            </Reveal>

            <dl className="mt-10 space-y-6">
              {groups.map((g, i) => (
                <Reveal key={g.title} delay={i * 0.07}>
                  <div className="flex gap-4 border-l-2 border-primary/50 pl-4 transition-colors hover:border-accent">
                    <dt className="w-32 shrink-0 font-display font-semibold">{g.title}</dt>
                    <dd className="text-muted">{g.items.map((t) => t.name).join(', ')}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          <Reveal delay={0.1}>
            <div className="relative">
              <Orbit onHover={setHovered} />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-primary/50 bg-surface text-center shadow-[0_0_70px_-10px] shadow-primary/30 sm:h-32 sm:w-32"
              >
                <span className="node-pulse absolute inset-0 rounded-full border border-accent/40" />
                <span className="px-2 font-display text-sm font-bold sm:text-base">{hovered ? hovered.name : 'SkyTech'}</span>
                <span className="text-[10px] uppercase tracking-widest text-muted">{hovered ? hovered.category : 'Our stack'}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
