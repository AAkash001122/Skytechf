import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import Section, { SectionHeading } from '../components/Section';
import Button from '../components/Button';
import CtaBanner from '../components/CtaBanner';
import Hero from '../components/home/Hero';
import ServicesNetwork from '../components/home/ServicesNetwork';
import Process from '../components/home/Process';
import TechStrip from '../components/home/TechStrip';
import SystemHub from '../components/home/SystemHub';
import Why from '../components/home/Why';
import Engagement from '../components/home/Engagement';
import Faq from '../components/home/Faq';

export default function Home() {
  return (
    <>
      <Seo
        description="SkyTech builds custom web apps, SaaS products, CRM/ERP software and e-commerce sites for startups and businesses in India and worldwide. Get a free quote."
        path="/"
      />
      <Hero />

      <Section id="services" className="bright-bg" bg="glow">
        <SectionHeading
          eyebrow="Services"
          title="Everything you need to launch and grow online"
          text="From a first MVP to business-critical software, we cover design, development and support."
        />
        <div className="mt-12"><ServicesNetwork /></div>
        <div className="mt-8">
          <Button to="/services" variant="secondary">All services <ArrowRight size={16} aria-hidden="true" /></Button>
        </div>
      </Section>

      <Process />

      <TechStrip />
      <SystemHub />
      <Why />
      <Engagement />
      <Faq />
      <CtaBanner />
    </>
  );
}
