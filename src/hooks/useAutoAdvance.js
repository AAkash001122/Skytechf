import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/**
 * Cycles through `count` items while the element is on screen.
 * Pauses on hover, never runs with reduced motion, and stops for good once the visitor picks an item.
 */
export default function useAutoAdvance(count, ms = 5500) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-25% 0px' });
  const reduce = useReducedMotion();
  const playing = auto && inView && !hovered && !reduce;

  useEffect(() => {
    if (!playing) return undefined;
    const id = setTimeout(() => setActive((a) => (a + 1) % count), ms);
    return () => clearTimeout(id);
  }, [playing, active, count, ms]);

  const select = (i) => {
    setAuto(false);
    setActive(((i % count) + count) % count);
  };

  const hoverProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  return { active, select, playing, ref, hoverProps };
}
