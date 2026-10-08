/** Slow-drifting glow orbs behind the whole page. Pure CSS transforms, no blur filters. */
export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="orb-a absolute -left-[15%] top-[10%] h-[60vmax] w-[60vmax] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(closest-side, color-mix(in srgb, var(--color-blue) 14%, transparent), transparent)' }}
      />
      <div
        className="orb-b absolute -right-[20%] top-[45%] h-[55vmax] w-[55vmax] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(closest-side, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent)' }}
      />
    </div>
  );
}
