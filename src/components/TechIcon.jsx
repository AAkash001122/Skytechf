import { Cloud } from 'lucide-react';
import {
  siDocker, siExpress, siGit, siMongodb, siNextdotjs, siNodedotjs, siPostgresql,
  siPython, siReact, siTailwindcss, siTypescript,
} from 'simple-icons';

const icons = {
  react: siReact, nextjs: siNextdotjs, typescript: siTypescript, tailwind: siTailwindcss,
  nodejs: siNodedotjs, express: siExpress, python: siPython,
  mongodb: siMongodb, postgresql: siPostgresql, docker: siDocker, git: siGit,
};

/** Monochrome technology logo (inherits text color). AWS is not in simple-icons, so it falls back to a cloud icon. */
export default function TechIcon({ slug, size = 32 }) {
  const icon = icons[slug];
  if (!icon) return <Cloud size={size} aria-hidden="true" strokeWidth={1.75} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}
