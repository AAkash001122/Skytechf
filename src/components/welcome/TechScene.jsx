import { useEffect, useRef } from 'react';

const SKY = '96,165,250';
const BLUE = '37,99,235';
const DEEP = '59,130,246';

const rand = (a, b) => a + Math.random() * (b - a);

/**
 * Live futuristic backdrop on one canvas: perspective digital grid (floor + ceiling), connected network
 * nodes, falling data streams and light trails racing along the grid. Sized by CSS, DPR-capped, paused when
 * the tab is hidden, and drawn once (static) when `animate` is false (reduced motion).
 */
export default function TechScene({ animate = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, raf = 0, last = 0, t = 0;
    let nodes = [], streams = [], comets = [];

    const small = () => w < 640;
    const newStream = (anywhere) => ({ x: rand(0, w), y: anywhere ? rand(-h, h) : rand(-200, -20), len: rand(60, 170), speed: rand(70, 190), a: rand(0.18, 0.5) });
    const newComet = () => ({ i: Math.floor(rand(-6, 7)), p: rand(0, 1), speed: rand(0.16, 0.34) });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(80, (w * h) / 20000));
      nodes = Array.from({ length: count }, () => ({ x: rand(0, w), y: rand(0, h), vx: rand(-14, 14), vy: rand(-14, 14), r: rand(1, 2.4) }));
      streams = Array.from({ length: small() ? 7 : 15 }, () => newStream(true));
      comets = Array.from({ length: small() ? 4 : 8 }, newComet);
      draw(0);
    }

    function drawGrid() {
      const vx = w / 2;
      const horizon = h * 0.5;
      const cols = small() ? 7 : 13;
      const spacing = w / (cols - 1) * (small() ? 1.5 : 1.2);
      const rows = 16;
      const shift = (t * 0.22) % 1;

      // horizon glow
      const g = ctx.createRadialGradient(vx, horizon, 0, vx, horizon, w * 0.55);
      g.addColorStop(0, `rgba(${BLUE},0.34)`);
      g.addColorStop(1, `rgba(${BLUE},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const dir of [1, -1]) {
        const strength = dir === 1 ? 1 : 0.4; // floor is brighter than the ceiling
        ctx.lineWidth = 1;
        for (let k = 0; k < rows; k++) {
          const p = (k + shift) / rows;
          const y = horizon + dir * (h - horizon) * p ** 2.1;
          ctx.strokeStyle = `rgba(${SKY},${0.5 * p * strength})`;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
        for (let i = -cols; i <= cols; i++) {
          const xb = vx + i * spacing;
          const lg = ctx.createLinearGradient(0, horizon, 0, dir === 1 ? h : 0);
          lg.addColorStop(0, `rgba(${SKY},0)`);
          lg.addColorStop(1, `rgba(${SKY},${0.45 * strength})`);
          ctx.strokeStyle = lg;
          ctx.beginPath();
          ctx.moveTo(vx, horizon);
          ctx.lineTo(xb, dir === 1 ? h : 0);
          ctx.stroke();
        }
      }
      return { vx, horizon, spacing };
    }

    function drawComets(dt, { vx, horizon, spacing }) {
      for (const c of comets) {
        c.p += c.speed * dt;
        if (c.p > 1) { Object.assign(c, newComet(), { p: 0 }); }
        const xb = vx + c.i * spacing;
        for (let s = 0; s < 9; s++) {
          const p = Math.max(0, c.p - s * 0.018);
          const q = p ** 1.7;
          const x = vx + (xb - vx) * q;
          const y = horizon + (h - horizon) * q;
          const a = (1 - s / 9) * Math.min(1, q * 3) * 0.9;
          ctx.fillStyle = `rgba(${s === 0 ? '219,234,254' : SKY},${a})`;
          ctx.beginPath();
          ctx.arc(x, y, (s === 0 ? 2.4 : 1.6) * (0.5 + q), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function drawStreams(dt) {
      for (const s of streams) {
        s.y += s.speed * dt;
        if (s.y - s.len > h) Object.assign(s, newStream(false));
        const g = ctx.createLinearGradient(0, s.y - s.len, 0, s.y);
        g.addColorStop(0, `rgba(${DEEP},0)`);
        g.addColorStop(1, `rgba(${SKY},${s.a})`);
        ctx.fillStyle = g;
        ctx.fillRect(s.x, s.y - s.len, 1.5, s.len);
        ctx.fillStyle = `rgba(219,234,254,${s.a + 0.2})`;
        ctx.fillRect(s.x - 1, s.y - 2, 3.5, 3.5);
      }
    }

    function drawNodes(dt) {
      const reach = small() ? 90 : 130;
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < reach) {
            ctx.strokeStyle = `rgba(${DEEP},${(1 - d / reach) * 0.32})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${SKY},0.75)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function draw(dt) {
      ctx.clearRect(0, 0, w, h);
      const grid = drawGrid();
      drawStreams(dt);
      drawNodes(dt);
      drawComets(dt, grid);
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) { last = 0; return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      t += dt;
      draw(dt);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (animate) raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [animate]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
