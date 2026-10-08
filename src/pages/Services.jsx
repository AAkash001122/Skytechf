import Seo from '../components/Seo';
import Section, { SectionHeading } from '../components/Section';
import ServicesNetwork from '../components/home/ServicesNetwork';
import Process from '../components/home/Process';
import Engagement from '../components/home/Engagement';
import CtaBanner from '../components/CtaBanner';

export default function Services() {
  return (
    <>
      <Seo
        title="Services"
        description="Custom web apps, SaaS, CRM/ERP/CMS software, e-commerce, APIs and ongoing support. See what SkyTech can build for your business."
        path="/services"
      />
      <Section className="pb-10 sm:pb-12">
        <SectionHeading
          eyebrow="Services"
          title="Software built around your business"
          text="Whether you need a new product, a better internal tool or someone to look after what you already have, we can help."
        />
      </Section>
      <Section className="pt-0 sm:pt-0"><ServicesNetwork /></Section>
      <Process />
      <Engagement />
      <CtaBanner />
    </>
  );
}
