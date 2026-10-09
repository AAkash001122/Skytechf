import { ArrowUpRight, MapPin } from 'lucide-react';
import { site, whatsappLink } from '../config/site';
import Seo from '../components/Seo';
import Section, { SectionHeading } from '../components/Section';
import Icon from '../components/Icon';
import Reveal from '../components/Reveal';
import Button from '../components/Button';
import SpotlightCard from '../components/SpotlightCard';

const { careers, contact } = site;
const applyLink = (role) =>
  `mailto:${contact.email}?subject=${encodeURIComponent(role ? `Application: ${role}` : 'Career enquiry')}`;

export default function Career() {
  return (
    <>
      <Seo
        title="Career"
        description="Join SkyTech, a small software studio in Mumbai. See how we work, how we hire and how to apply."
        path="/career"
      />

      <Section className="bright-bg pb-14 sm:pb-16" bg="grid">
        <SectionHeading eyebrow="Career" title="Build great products with a team that cares" text={careers.intro} />
        <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={applyLink()}>Send your resume</Button>
          <Button href={whatsappLink('Hi SkyTech, I am interested in working with you.')} variant="secondary">Chat on WhatsApp</Button>
        </Reveal>
      </Section>

      <Section>
        <SectionHeading eyebrow="Why join us" title="What working here looks like" />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {careers.values.map((v, i) => (
            <li key={v.title}>
              <Reveal delay={i * 0.06} className="h-full">
                <SpotlightCard className="card-bright h-full rounded-3xl border border-ink/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-primary">
                    <Icon name={v.icon} size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted">{v.text}</p>
                </SpotlightCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="bright-bg border-y border-line">
        <SectionHeading eyebrow="Open roles" title="Current openings" />
        <div className="mt-10">
          {careers.roles.length === 0 ? (
            <Reveal>
              <div className="card-bright rounded-3xl border border-dashed border-ink/20 p-8 sm:p-10">
                <h3 className="text-xl font-semibold">No open roles listed right now</h3>
                <p className="mt-2 max-w-xl text-muted">
                  We are always happy to meet talented developers and designers. Send your resume or portfolio and we will
                  reach out when a suitable role opens.
                </p>
                <Button href={applyLink()} className="mt-6">Send your resume</Button>
              </div>
            </Reveal>
          ) : (
            <ul className="space-y-4">
              {careers.roles.map((r) => (
                <li key={r.title}>
                  <Reveal>
                    <article className="card-bright flex flex-col gap-4 rounded-2xl border border-ink/10 p-6 transition-colors hover:border-accent/50 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{r.title}</h3>
                        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                          <span>{r.type}</span>
                          <span className="inline-flex items-center gap-1"><MapPin size={14} aria-hidden="true" />{r.location}</span>
                        </p>
                        <p className="mt-2 max-w-xl text-muted">{r.summary}</p>
                      </div>
                      <Button href={applyLink(r.title)} variant="secondary" className="shrink-0">
                        Apply <ArrowUpRight size={16} aria-hidden="true" />
                      </Button>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Hiring process" title="Simple, respectful and quick" />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {careers.hiring.map((h, i) => (
            <li key={h.title}>
              <Reveal delay={i * 0.06} className="h-full">
                <div className="card-bright h-full rounded-3xl border border-ink/10 p-6">
                  <span className="font-display text-3xl font-bold text-gradient">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 text-lg font-semibold">{h.title}</h3>
                  <p className="mt-2 text-sm text-muted">{h.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
