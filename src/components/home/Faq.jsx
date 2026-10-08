import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { site } from '../../config/site';
import Section, { SectionHeading } from '../Section';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Section className="border-t border-line bg-surface/30">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading eyebrow="FAQ" title="Questions we hear often" text="Cannot find your answer? Message us and we will reply the same day." />
        <ul className="divide-y divide-line border-y border-line">
          {site.faqs.map((f, i) => {
            const open = openIndex === i;
            return (
              <li key={f.q}>
                <h3>
                  <button
                    type="button"
                    id={`faq-btn-${i}`}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold"
                  >
                    {f.q}
                    <ChevronDown
                      aria-hidden="true"
                      className={`shrink-0 text-accent-text transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                </h3>
                <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} hidden={!open}>
                  <p className="pb-5 text-muted">{f.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
