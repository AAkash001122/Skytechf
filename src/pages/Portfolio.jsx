import { projects } from '../config/projects';
import Seo from '../components/Seo';
import Section, { SectionHeading } from '../components/Section';
import ProjectCase from '../components/ProjectCase';
import CtaBanner from '../components/CtaBanner';

export default function Portfolio() {
  return (
    <>
      <Seo
        title="Portfolio"
        description="Case studies from SkyTech: a media distribution platform, a film CMS and a music platform. See the problem, solution, tech and results."
        path="/portfolio"
      />
      <Section className="pb-10 sm:pb-12">
        <SectionHeading
          eyebrow="Portfolio"
          title="Case studies"
          text="Real products for real businesses. Each one started with a problem worth solving."
        />
      </Section>
      <Section className="pt-0 sm:pt-0">
        <div className="space-y-20 sm:space-y-28">
          {projects.map((p, i) => <ProjectCase key={p.slug} project={p} index={i} />)}
        </div>
      </Section>
      <CtaBanner />
    </>
  );
}
