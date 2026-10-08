import { Link } from 'react-router-dom';
import { site } from '../config/site';
import logo from '../assets/Skyteck.png';

// Brand logo (src/assets/Skyteck.png, 642x264). Sized by height only (`w-auto`), so it is never stretched or cropped.
// Its navy plate matches the page background, so it sits flush on the dark theme.
export default function Logo({ className = '', sizeClass = 'h-12 sm:h-14 md:h-12 lg:h-16 xl:h-[4.5rem]' }) {
  return (
    <Link
      to="/"
      aria-label={`${site.name} home`}
      className={`group inline-flex shrink-0 items-center ${className}`}
    >
      <img
        src={logo}
        alt={site.name}
        width="642"
        height="264"
        decoding="async"
        className={`${sizeClass} w-auto select-none rounded-xl object-contain transition-all duration-300 group-hover:scale-[1.04] group-hover:drop-shadow-[0_0_14px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]`}
      />
    </Link>
  );
}
