import Reveal from './Reveal';
import SectionBackdrop from './SectionBackdrop';

export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, text, className = '' }) {
  return (
    <Reveal className={`relative max-w-2xl ${className}`}>
      <span aria-hidden="true" className={`heading-glow top-1/2 -translate-y-1/2 ${className.includes('text-center') ? 'left-1/2 -translate-x-1/2' : '-left-10'}`} />
      {eyebrow && (
        <p className={`mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-accent-text ${className.includes('text-center') ? 'justify-center' : ''}`}>
          <span aria-hidden="true" className="h-0.5 w-6 rounded-full bg-gradient-to-r from-primary to-blue" />
          {eyebrow}
          <span aria-hidden="true" className="caret -ml-1.5 inline-block h-3.5 w-1.5 bg-success/70" />
        </p>
      )}
      <h2 className="text-balance text-3xl font-bold sm:text-4xl md:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-muted">{text}</p>}
    </Reveal>
  );
}

/** `bg` adds an animated IT-themed backdrop (see SectionBackdrop for the variants). */
export default function Section({ id, className = '', bg, children }) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${bg ? 'relative isolate overflow-hidden' : ''} ${className}`}>
      {bg && <SectionBackdrop variant={bg} />}
      {bg && <span aria-hidden="true" className="section-rule" />}
      <Container className={bg ? 'relative' : ''}>{children}</Container>
    </section>
  );
}
