/** Card with a soft cursor-following glow on hover (see `spotlight` in index.css). */
export default function SpotlightCard({ as: Tag = 'article', className = '', children }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <Tag onMouseMove={onMove} className={`spotlight ${className}`}>
      <div className="relative flex h-full flex-col">{children}</div>
    </Tag>
  );
}
