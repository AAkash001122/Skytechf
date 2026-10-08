import Reveal from './Reveal';

export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, text, className = '' }) {
  return (
    <Reveal className={`max-w-2xl ${className}`}>
      {eyebrow && (
        <p className={`mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-accent-text ${className.includes('text-center') ? 'justify-center' : ''}`}>
          <span aria-hidden="true" className="h-0.5 w-6 rounded-full bg-gradient-to-r from-primary to-blue" />
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl font-bold sm:text-4xl md:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-muted">{text}</p>}
    </Reveal>
  );
}

export default function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
