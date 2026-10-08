import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import Button from './Button';

function Visual({ project }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`${project.name} screenshot`}
        loading="lazy"
        width="800"
        height="500"
        className="aspect-[16/10] w-full rounded-2xl border border-line object-cover"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`Image placeholder for ${project.name}`}
      className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-surface p-6 text-center"
    >
      <span className="font-display text-2xl font-semibold">{project.name}</span>
      <span className="text-sm text-muted">[ADD SCREENSHOT]</span>
    </div>
  );
}

function Block({ label, children }) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-widest text-accent-text">{label}</h4>
      <p className="mt-1.5 text-muted">{children}</p>
    </div>
  );
}

export default function ProjectCase({ project, index }) {
  const flip = index % 2 === 1;
  return (
    <Reveal>
      <article id={project.slug} className="scroll-mt-24 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div className={flip ? 'lg:order-2' : ''}><Visual project={project} /></div>
        <div className="space-y-5">
          <div>
            <p className="text-sm text-muted">{project.category}</p>
            <h3 className="mt-1 text-3xl font-bold">{project.name}</h3>
            <p className="mt-2 text-muted">{project.summary}</p>
          </div>
          <Block label="Problem">{project.problem}</Block>
          <Block label="Solution">{project.solution}</Block>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-accent-text">Tech used</h4>
            <ul className="mt-2 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 text-sm text-accent-text">{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-accent-text">Result</h4>
            <p className="mt-1.5 font-display text-xl font-semibold text-success">{project.result}</p>
          </div>
          {project.liveUrl && (
            <Button href={project.liveUrl} variant="secondary" aria-label={`Visit live site: ${project.name} (opens in a new tab)`}>
              Visit live site <ArrowUpRight size={16} aria-hidden="true" />
            </Button>
          )}
        </div>
      </article>
    </Reveal>
  );
}
