import {
  Blocks, Code2, Headset, Layers, LayoutDashboard, LifeBuoy, MessagesSquare, PenTool, Rocket, Search,
  Server, ShieldCheck, ShoppingCart, Smartphone, Zap,
} from 'lucide-react';

const icons = {
  Blocks, Code2, Headset, Layers, LayoutDashboard, LifeBuoy, MessagesSquare, PenTool, Rocket, Search,
  Server, ShieldCheck, ShoppingCart, Smartphone, Zap,
};

/** Renders a lucide icon by name (names come from src/config/site.js). */
export default function Icon({ name, ...props }) {
  const Cmp = icons[name];
  return Cmp ? <Cmp aria-hidden="true" {...props} /> : null;
}

const brand = {
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  github: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </>
  ),
  x: (
    <>
      <path d="M4 4l11.7 16H20L8.3 4H4z" />
      <path d="M4 20l6.8-6.8M13.2 10.8L20 4" />
    </>
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
};

export function BrandIcon({ name, size = 20 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      {brand[name]}
    </svg>
  );
}
