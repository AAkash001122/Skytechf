import { Check } from 'lucide-react';
import { site } from '../../config/site';
import Section, { SectionHeading } from '../Section';
import Reveal from '../Reveal';
import Button from '../Button';
import SpotlightCard from '../SpotlightCard';
import WhyVisual from './WhyVisuals';

const commitments = site.trustLine.split('. ').map((t) => t.replace(/\.$/, ''));

// Column spans on the 12-column desktop grid, in the order of site.why.
const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'];

export default function Why() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Why SkyTech"
        title="A small team that behaves like part of yours"
        text="You work directly with the people building your product, with no layers in between."
        className="mx-auto text-center"
      />
      <Reveal delay={0.1}>
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {commitments.map((c) => (
            <li key={c} className="glass flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success">
                <Check size={12} aria-hidden="true" strokeWidth={3} />
              </span>
              {c}
            </li>
          ))}
        </ul>
      </Reveal>

      <ul className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {site.why.map((w, i) => (
          <li key={w.title} className={`min-w-0 ${spans[i]}`}>
            <Reveal delay={i * 0.08} className="h-full">
              <SpotlightCard className="card-bright group h-full rounded-3xl border border-ink/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_20px_50px_-20px] hover:shadow-primary/30 sm:p-7">
                <WhyVisual icon={w.icon} />
                <h3 className="mt-6 text-xl font-semibold">{w.title}</h3>
                <p className="mt-2 text-muted">{w.text}</p>
                <p className="mt-5 inline-flex w-fit items-center rounded-full border border-ink/10 bg-ink/5 px-3 py-1 text-xs font-semibold text-accent-text">
                  {w.tag}
                </p>
              </SpotlightCard>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="mt-10 text-center">
        <Button to="/contact">Talk to our team</Button>
      </Reveal>
    </Section>
  );
}
