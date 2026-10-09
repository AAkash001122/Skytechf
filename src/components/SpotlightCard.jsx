/** Card with a soft cursor-following glow on hover (see `spotlight` in index.css). */
export default function SpotlightCard({ as: Tag = 'article', className = '', children }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
    if (window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
      e.currentTarget.style.setProperty('--rx', `${((0.5 - (e.clientY - r.top) / r.height) * 5).toFixed(2)}deg`);
      e.currentTarget.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2)}deg`);
      e.currentTarget.style.setProperty('--lift', '-3px');
    }
  };
  const onLeave = (e) => {
    ['--rx', '--ry', '--lift'].forEach((p) => e.currentTarget.style.removeProperty(p));
  };
  return (
    <Tag onMouseMove={onMove} onMouseLeave={onLeave} className={`spotlight hud tilt ${className}`}>
      <div className="relative flex h-full flex-col">{children}</div>
    </Tag>
  );
}
