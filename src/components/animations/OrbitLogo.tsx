"use client";

import { useEffect, useRef } from "react";

export type OrbitLogoProps = {
  size?: number;
  className?: string;
  onClick?: () => void;
};

// ---------------------------------------------------------------------------
// R Geometry (110 x 110 normalized coordinate box from r-logo-animation.html)
// ---------------------------------------------------------------------------
const OUTER_PATH_STR =
  "M16 8 H58 C80 8 90 21 90 35 C90 48 82 57 68 60 L94 102 H70 L48 64 H38 V102 H16 Z";
const INNER_PATH_STR =
  "M38 26 V46 H56 C65 46 68 41 68 36 C68 30 64 26 56 26 Z";

export default function OrbitLogo({
  size = 240,
  className = "",
  onClick,
}: OrbitLogoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Timeline Configuration (12.5s loop matching r-logo-animation.html)
    const LOOP = 12.5;
    const T = {
      gather: [0.0, 3.6] as [number, number], // particles swirl in and form the R
      stroke: [2.8, 5.2] as [number, number], // neon outline draws itself
      fill: [4.6, 5.8] as [number, number], // glass fill fades in
      orbit: [3.4, 9.6] as [number, number], // orbital rings sweep around
      hold: 8.4, // logo fully built until here
      dissolve: [8.4, 10.8] as [number, number], // R breaks back into particles
    };

    // Cached Path2D geometries (instantiated inside effect for SSR safety)
    const pathAll = new Path2D(`${OUTER_PATH_STR} ${INNER_PATH_STR}`);
    const pathOuter = new Path2D(OUTER_PATH_STR);
    const pathInner = new Path2D(INNER_PATH_STR);

    let W = 0;
    let H = 0;
    let dpr = 1;
    let s = 1;
    let cx = 0;
    let cy = 0;
    let L = 0;
    let animationId = 0;
    let startTime = 0;

    interface Particle {
      hx: number;
      hy: number;
      sx: number;
      sy: number;
      delay: number;
      size: number;
      tw: number;
      hue: number;
    }
    let particles: Particle[] = [];

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // Easing helpers
    const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const prog = (t: number, [a, b]: [number, number]) => clamp((t - a) / (b - a));
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
    const easeIn = (x: number) => x * x * x;
    const easeIO = (x: number) =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    // Sample points inside R shape
    const buildParticles = () => {
      if (!W || !H || s <= 0) return;

      const off = document.createElement("canvas");
      off.width = Math.ceil(W);
      off.height = Math.ceil(H);
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;

      o.translate(cx - 55 * s, cy - 55 * s);
      o.scale(s, s);
      o.fill(pathAll, "evenodd");

      const data = o.getImageData(0, 0, off.width, off.height).data;
      const step = Math.max(2, s * 1.05);

      particles = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          const px = Math.floor(x + (Math.random() - 0.5) * step);
          const py = Math.floor(y + (Math.random() - 0.5) * step);
          if (px < 0 || py < 0 || px >= off.width || py >= off.height) continue;
          if (data[(py * off.width + px) * 4 + 3] < 128) continue;

          const ang = Math.random() * Math.PI * 2;
          const rad = Math.min(W, H) * (0.3 + Math.random() * 0.22);

          particles.push({
            hx: px,
            hy: py,
            sx: cx + Math.cos(ang) * rad,
            sy: cy + Math.sin(ang) * rad * 0.85,
            delay: Math.random() * 0.35,
            size: 0.7 + Math.random() * 1.4,
            tw: Math.random() * 6.28,
            hue: Math.random(),
          });
        }
      }
    };

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const container = containerRef.current;
      const rect = container ? container.getBoundingClientRect() : null;
      const measuredW = rect && rect.width > 0 ? rect.width : size;
      const measuredH = rect && rect.height > 0 ? rect.height : size;

      // Clamp dimensions to safe bounds (10px to 1200px) so memory never overflows
      const nextW = Math.max(10, Math.min(Math.round(measuredW), 1200));
      const nextH = Math.max(10, Math.min(Math.round(measuredH), 1200));

      const sizeChanged = Math.abs(nextW - W) > 1 || Math.abs(nextH - H) > 1;

      W = nextW;
      H = nextH;

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);

      cx = W / 2;
      cy = H / 2;
      L = Math.min(W, H) * 0.46; // logo height in px
      s = L / 94; // path units -> px

      if (sizeChanged || particles.length === 0) {
        buildParticles();
      }
    };

    // Draw Helpers
    const withLogoTransform = (fn: () => void) => {
      ctx.save();
      ctx.translate(cx - 55 * s, cy - 55 * s);
      ctx.scale(s, s);
      fn();
      ctx.restore();
    };

    const drawParticles = (t: number, cycle: number) => {
      const g = prog(t, T.gather);
      const d = prog(t, T.dissolve);
      const dir = cycle % 2 ? 1 : -1; // swirl direction flips each loop

      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        let a: number;
        if (t < T.gather[1] + 0.4) {
          a = easeOut(clamp((g - p.delay) / (1 - 0.35)));
        } else if (t < T.dissolve[0]) {
          a = 1;
        } else {
          a = 1 - easeIn(clamp((d - p.delay) / (1 - 0.35)));
        }

        // Rotate scatter offset while travelling = spiral motion
        const ox = p.sx - cx;
        const oy = p.sy - cy;
        const rot = (1 - a) * 2.4 * dir;
        const cr = Math.cos(rot);
        const sr = Math.sin(rot);
        const rx = cx + ox * cr - oy * sr;
        const ry = cy + ox * sr + oy * cr;

        const x = rx + (p.hx - rx) * a;
        const y = ry + (p.hy - ry) * a;
        const tw = 0.65 + 0.35 * Math.sin(t * 3 + p.tw);
        const alpha = (0.28 + 0.72 * (1 - a) + 0.15 * a) * tw;
        const light = 55 + p.hue * 30;

        ctx.fillStyle = `hsla(${196 + p.hue * 30},100%,${light}%,${alpha})`;
        const r = p.size * (1 + (1 - a) * 0.5);
        ctx.fillRect(x - r / 2, y - r / 2, r, r);
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const drawFill = (t: number) => {
      const f = easeIO(prog(t, T.fill)) * (1 - easeIn(prog(t, T.dissolve)));
      if (f <= 0) return;

      withLogoTransform(() => {
        const g = ctx.createLinearGradient(10, 8, 94, 102);
        g.addColorStop(0, `rgba(120,200,255,${0.38 * f})`);
        g.addColorStop(0.5, `rgba(40,120,255,${0.2 * f})`);
        g.addColorStop(1, `rgba(20,60,200,${0.1 * f})`);
        ctx.fillStyle = g;
        ctx.fill(pathAll, "evenodd");
      });
    };

    const drawStroke = (t: number) => {
      const p = easeIO(prog(t, T.stroke));
      const fade = 1 - easeIn(prog(t, T.dissolve));
      if (p <= 0 || fade <= 0) return;

      const pulse = 0.85 + 0.15 * Math.sin(t * 2.2);

      withLogoTransform(() => {
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        const dash = p * 620;
        ctx.setLineDash([dash, 2000]);

        for (const pth of [pathOuter, pathInner]) {
          ctx.shadowColor = "rgba(40,150,255,1)";
          ctx.shadowBlur = 26 * s * 0.35 * pulse;
          ctx.strokeStyle = `rgba(40,140,255,${0.9 * fade})`;
          ctx.lineWidth = 3.2;
          ctx.stroke(pth);

          ctx.shadowBlur = 8;
          ctx.strokeStyle = `rgba(200,235,255,${fade})`;
          ctx.lineWidth = 1.1;
          ctx.stroke(pth);
        }
        ctx.setLineDash([]);
      });
      ctx.shadowBlur = 0;
    };

    const orbits = [
      { rx: 0.78, ry: 0.28, rot: -0.5, sp: 1.15, ph: 0 },
      { rx: 0.70, ry: 0.24, rot: 0.75, sp: -0.9, ph: 2.1 },
      { rx: 0.86, ry: 0.2, rot: 2.1, sp: 0.7, ph: 4.2 },
    ];

    const drawOrbits = (t: number) => {
      const inn = easeOut(prog(t, [T.orbit[0], T.orbit[0] + 1.6]));
      const out = 1 - easeIn(prog(t, [T.dissolve[0], T.dissolve[0] + 1.6]));
      const env = inn * out;
      if (env <= 0.01) return;

      ctx.globalCompositeOperation = "lighter";
      orbits.forEach((o, i) => {
        const rx = o.rx * L * (0.6 + 0.4 * inn);
        const ry = o.ry * L * (0.6 + 0.4 * inn);
        const rot = o.rot + t * 0.12 * (i + 1) * Math.sign(o.sp);
        const head = t * o.sp * 1.6 + o.ph;

        const pt = (a: number): [number, number] => {
          const x = Math.cos(a) * rx;
          const y = Math.sin(a) * ry;
          return [
            cx + x * Math.cos(rot) - y * Math.sin(rot),
            cy + x * Math.sin(rot) + y * Math.cos(rot),
          ];
        };

        ctx.lineCap = "round";

        // Faint full ring
        ctx.beginPath();
        for (let k = 0; k <= 90; k++) {
          const [x, y] = pt((k / 90) * Math.PI * 2);
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(80,160,255,${0.1 * env})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glowing comet tail
        const n = 36;
        const dirn = Math.sign(o.sp);
        for (let k = 0; k < n; k++) {
          const a0 = head - dirn * k * 0.045;
          const a1 = head - dirn * (k + 1) * 0.045;
          const [x0, y0] = pt(a0);
          const [x1, y1] = pt(a1);

          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.strokeStyle = `rgba(110,200,255,${(1 - k / n) * 0.85 * env})`;
          ctx.lineWidth = 2.6 * (1 - k / n) + 0.4;
          ctx.stroke();
        }

        // Orbiting star head with soft radial flare
        const [hx, hy] = pt(head);
        const flareRadius = Math.max(5, 14 * (L / 120));
        const gr = ctx.createRadialGradient(hx, hy, 0, hx, hy, flareRadius);
        gr.addColorStop(0, `rgba(220,245,255,${env})`);
        gr.addColorStop(0.3, `rgba(80,180,255,${0.6 * env})`);
        gr.addColorStop(1, "rgba(40,120,255,0)");

        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(hx, hy, flareRadius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";
    };

    const drawAura = (t: number) => {
      const built = easeIO(prog(t, T.fill)) * (1 - easeIn(prog(t, T.dissolve)));
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, L * 0.95);
      g.addColorStop(0, `rgba(30,110,255,${0.05 + 0.2 * built})`);
      g.addColorStop(1, "rgba(30,110,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    // Main animation frame
    const frame = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / 1000;
      const sec = reducedMotion.matches ? T.hold - 0.5 : elapsed;
      const t = sec % LOOP;
      const cycle = Math.floor(sec / LOOP);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      drawAura(t);
      drawParticles(t, cycle);
      drawFill(t);
      drawStroke(t);
      drawOrbits(t);

      if (!reducedMotion.matches) {
        animationId = requestAnimationFrame(frame);
      }
    };

    setup();

    const container = containerRef.current;
    const observer = new ResizeObserver(() => {
      setup();
    });
    if (container) {
      observer.observe(container);
    }

    animationId = requestAnimationFrame(frame);

    const onMotionChange = () => {
      cancelAnimationFrame(animationId);
      if (reducedMotion.matches) frame(performance.now());
      else animationId = requestAnimationFrame(frame);
    };

    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size }}
      className={`relative inline-block shrink-0 aspect-square overflow-visible isolate select-none ${className}`}
      aria-label="Animated R logo"
      role="img"
      onClick={onClick}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
        className="block w-full h-full overflow-visible"
      />
    </div>
  );
}

export { OrbitLogo };
