import { useEffect, useRef } from 'react';

const CELL = 16;
const TRAIL = 16;

/**
 * Matrix-style digital rain of 0s and 1s: green columns with some electric-blue ones. Transparent canvas so the
 * page behind the overlay stays visible; capped to ~24 fps and paused while the tab is hidden.
 */
export default function BinaryRain({ animate = true, density = 1, blueRatio = 0.28, className = 'opacity-70' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, cols = 0, raf = 0, last = 0, acc = 0, tick = 0;
    let heads = [], speeds = [], blue = [], active = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${CELL - 3}px "Courier New", monospace`;
      ctx.textAlign = 'center';
      cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);
      heads = Array.from({ length: cols }, () => Math.random() * (rows + TRAIL) - TRAIL);
      speeds = Array.from({ length: cols }, () => 0.25 + Math.random() * 0.55);
      blue = Array.from({ length: cols }, () => Math.random() < blueRatio);
      active = Array.from({ length: cols }, () => Math.random() < density);
      draw();
    }

    // Stable pseudo-random bit per cell that flips slowly, so digits shimmer instead of strobing.
    const bit = (c, r) => ((((c * 73856093) ^ (r * 19349663) ^ (Math.floor(tick / 6) * 83492791)) >>> 0) % 2);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const rows = Math.ceil(h / CELL);
      for (let c = 0; c < cols; c++) {
        if (!active[c]) continue;
        const head = Math.floor(heads[c]);
        const rgb = blue[c] ? '96,165,250' : '74,222,128';
        for (let k = 0; k < TRAIL; k++) {
          const r = head - k;
          if (r < 0 || r > rows) continue;
          const a = k === 0 ? 0.95 : (1 - k / TRAIL) * 0.5;
          ctx.fillStyle = k === 0 ? `rgba(220,252,231,${a})` : `rgba(${rgb},${a})`;
          ctx.fillText(String(bit(c, r)), c * CELL + CELL / 2, r * CELL + CELL);
        }
      }
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) { last = 0; return; }
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      acc += dt;
      if (acc < 1 / 24) return;
      const step = acc * 24;
      acc = 0;
      tick += 1;
      const rows = Math.ceil(h / CELL);
      for (let c = 0; c < cols; c++) {
        heads[c] += speeds[c] * step;
        if (heads[c] - TRAIL > rows) {
          heads[c] = -Math.random() * 12;
          speeds[c] = 0.25 + Math.random() * 0.55;
        }
      }
      draw();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (animate) raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [animate, density, blueRatio]);

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`} />;
}
