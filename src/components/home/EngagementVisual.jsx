/** Tiny animated diagram for each engagement model (decorative). */
function Milestones() {
  const xs = [10, 40, 70, 100];
  return (
    <svg viewBox="0 0 110 30" className="h-full w-full" fill="none">
      <line x1="10" y1="15" x2="100" y2="15" strokeWidth="1" className="dash-flow stroke-accent/70" />
      {xs.map((x, i) => (
        <circle
          key={x} cx={x} cy="15" r="4"
          className="node-pulse fill-primary stroke-accent"
          strokeWidth="1"
          style={{ animationDelay: `${i * 0.5}s`, transformOrigin: `${x}px 15px`, transformBox: 'view-box' }}
        />
      ))}
    </svg>
  );
}

function Clock() {
  return (
    <svg viewBox="0 0 40 40" className="h-full" fill="none">
      <circle cx="20" cy="20" r="16" strokeWidth="1.5" className="stroke-accent/70" />
      <g className="orbit-spin" style={{ '--d': '6s', transformOrigin: '20px 20px' }}>
        <line x1="20" y1="20" x2="20" y2="8" strokeWidth="2" strokeLinecap="round" className="stroke-primary-text" />
      </g>
      <circle cx="20" cy="20" r="1.8" className="fill-ink" />
    </svg>
  );
}

function Team() {
  const pts = [[20, 8], [8, 30], [32, 30]];
  return (
    <svg viewBox="0 0 40 40" className="h-full" fill="none">
      <polygon points="20,8 8,30 32,30" strokeWidth="1" className="dash-flow stroke-accent/70" />
      {pts.map(([x, y], i) => (
        <circle
          key={i} cx={x} cy={y} r="3.5"
          className="node-pulse fill-primary stroke-accent"
          strokeWidth="1"
          style={{ animationDelay: `${i * 0.6}s`, transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' }}
        />
      ))}
    </svg>
  );
}

const visuals = { milestones: Milestones, clock: Clock, team: Team };

export default function EngagementVisual({ type }) {
  const Cmp = visuals[type];
  if (!Cmp) return null;
  return (
    <div aria-hidden="true" className="mb-5 flex h-14 items-center">
      <Cmp />
    </div>
  );
}
