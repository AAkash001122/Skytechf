import { CalendarDays } from 'lucide-react';
import { site } from '../config/site';
import { Container } from './Section';
import Reveal from './Reveal';
import Button from './Button';

export default function CtaBanner() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="cta-animated relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20">
            <div aria-hidden="true" className="float-y pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full border border-ink/20" />
            <div aria-hidden="true" className="float-y pointer-events-none absolute -bottom-16 -right-10 h-56 w-56 rounded-full border border-ink/15" style={{ animationDelay: '-3s' }} />
            <div aria-hidden="true" className="spin-slow pointer-events-none absolute right-[12%] top-8 hidden h-16 w-16 rounded-2xl border border-ink/25 sm:block" />
            <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold sm:text-5xl">
              Ready to build something that grows your business?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink/85">
              Tell us about your idea. We will reply within one working day with next steps.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button to="/contact" variant="light" className="px-7 py-3.5 text-base">Start your project</Button>
              <Button href={site.contact.bookCallUrl} variant="outline" className="px-7 py-3.5 text-base">
                <CalendarDays size={18} aria-hidden="true" /> Book a call
              </Button>
            </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
