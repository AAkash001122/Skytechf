import { Check } from 'lucide-react';
import { site } from '../../config/site';
import Section, { SectionHeading } from '../Section';
import Reveal from '../Reveal';
import Button from '../Button';
import EngagementVisual from './EngagementVisual';

export default function Engagement() {
  return (
    <Section className="border-y border-line bg-surface/30">
      <SectionHeading
        eyebrow="Engagement models"
        title="Work with us the way that suits you"
        text="Pick the model that fits your project. We will recommend one after a short call."
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {site.engagement.map((m, i) => (
          <Reveal key={m.title} delay={i * 0.07} className="h-full">
            <article
              className={`flex h-full flex-col rounded-2xl border p-7 ${
                m.highlight ? 'border-primary bg-surface shadow-lg shadow-primary/10' : 'border-line bg-surface'
              }`}
            >
              <EngagementVisual type={m.visual} />
              <h3 className="text-2xl font-semibold">{m.title}</h3>
              <p className="mt-3 text-muted">{m.text}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {m.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm">
                    <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-success" />{p}
                  </li>
                ))}
              </ul>
              <Button to="/contact" variant={m.highlight ? 'primary' : 'secondary'} className="mt-8">Get a quote</Button>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
