import { site } from '../config/site';
import Seo from '../components/Seo';
import Section, { SectionHeading } from '../components/Section';
import Reveal from '../components/Reveal';
import Why from '../components/home/Why';
import TechStrip from '../components/home/TechStrip';
import CtaBanner from '../components/CtaBanner';

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="SkyTech is a small software studio in Mumbai. Learn how we work and what we value when building web products for clients in India and worldwide."
        path="/about"
      />
      <Section className="pb-10 sm:pb-12" bg="nodes">
        <SectionHeading eyebrow="About" title="A focused team that builds products to last" text={site.about.intro} />
        <Reveal className="mt-8 max-w-2xl"><p className="text-lg text-muted">{site.about.story}</p></Reveal>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <h2 className="sr-only">Our values</h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {site.about.values.map((v, i) => (
            <li key={v.title}>
              <Reveal delay={i * 0.07} className="h-full">
                <article className="h-full rounded-2xl border border-line bg-surface p-7">
                  <h3 className="text-xl font-semibold">{v.title}</h3>
                  <p className="mt-2 text-muted">{v.text}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <TechStrip />
      <Why />
      <CtaBanner />
    </>
  );
}
