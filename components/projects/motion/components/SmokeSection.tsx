"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type SmokeSectionProps = {
  /** Warna asap dalam format "r, g, b". Default oren. */
  color?: string;
  /** Tebal/terangnya asap. 1 = normal. */
  intensity?: number;
  /**
   * "lighter" = glow aditif, bagus di background gelap.
   * "source-over" = asap biasa, untuk background terang.
   */
  blend?: "lighter" | "source-over";
  /** Atur background & tinggi lewat className, mis. "min-h-[600px] bg-neutral-950" */
  className?: string;
  children?: ReactNode;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxLife: number;
  size: number;
  alpha: number;
};

const TAU = Math.PI * 2;

// Value noise 2D yang ringan (cukup untuk flow field asap)
function makeNoise() {
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const fade = (t: number) => t * t * (3 - 2 * t);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const X = xi & 255;
    const Y = yi & 255;
    const u = fade(x - xi);
    const w = fade(y - yi);
    const v = (a: number, b: number) => perm[perm[X + a] + Y + b] / 255;
    return lerp(lerp(v(0, 0), v(1, 0), u), lerp(v(0, 1), v(1, 1), u), w);
  };
}

// Sprite asap: gradien radial lembut, dibuat sekali lalu dipakai berulang
function makeSprite(color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(${color}, 1)`);
  grad.addColorStop(0.35, `rgba(${color}, 0.4)`);
  grad.addColorStop(1, `rgba(${color}, 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return c;
}

export default function SmokeSection({
  color = "249, 115, 22",
  intensity = 1,
  blend = "lighter",
  className = "min-h-[560px]",
  children,
}: SmokeSectionProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, inside: false });

  const inView = useInView(wrapRef);
  const inViewRef = useRef(false);

  useEffect(() => {
    inViewRef.current = inView;
  });

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise = makeNoise();
    const sprite = makeSprite(color);

    let w = 0;
    let h = 0;
    let t = 0;
    let raf = 0;
    let last = performance.now();
    let particles: Particle[] = [];
    const leader = { x: 0, y: 0, vx: 0, vy: 0 };

    const base = () => Math.max(Math.min(w, h), 320);

    // Munculkan partikel: sebagian keluar dari titik pemimpin, sisanya
    // tersebar di seluruh section supaya asap selalu memenuhi ruang.
    const spawn = (p: Particle, initial: boolean) => {
      const fromLeader = !initial && Math.random() < (pointer.current.inside ? 0.55 : 0.3);

      if (fromLeader) {
        p.x = leader.x + (Math.random() - 0.5) * 50;
        p.y = leader.y + (Math.random() - 0.5) * 50;
        p.vx = leader.vx * 0.6;
        p.vy = leader.vy * 0.6;
        p.size = base() * (0.22 + Math.random() * 0.3);
        p.alpha = (0.13 + Math.random() * 0.1) * intensity;
      } else {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
        p.vx = 0;
        p.vy = 0;
        p.size = base() * (0.25 + Math.random() * 0.35);
        p.alpha = (0.045 + Math.random() * 0.06) * intensity;
      }
      p.maxLife = 200 + Math.random() * 260;
      p.age = initial ? Math.random() * p.maxLife : 0;
    };

    const init = () => {
      const count = Math.round(Math.min(Math.max((w * h) / 7000, 70), 200));
      particles = Array.from({ length: count }, () => {
        const p = {} as Particle;
        spawn(p, true);
        return p;
      });
      leader.x = w / 2;
      leader.y = h / 2;
    };

    const step = (dt: number) => {
      t += dt;
      const b = base();
      const S = 1.6 / b; // skala noise mengikuti ukuran section

      // --- Titik pemimpin ---
      const { inside, x: px, y: py } = pointer.current;
      let tx: number;
      let ty: number;
      let ease: number;
      if (inside) {
        tx = px;
        ty = py;
        ease = 0.1;
      } else {
        // acak tapi mulus: ditarik noise, ditambah getaran kecil
        const n1 = noise(t * 0.004 + 3.1, 7.7);
        const n2 = noise(t * 0.004 + 91.3, 2.2);
        const j1 = noise(t * 0.02, 5.5) - 0.5;
        const j2 = noise(t * 0.02 + 40, 9.9) - 0.5;
        tx = w * (0.5 + (n1 - 0.5) * 1.7 + j1 * 0.25);
        ty = h * (0.5 + (n2 - 0.5) * 1.7 + j2 * 0.25);
        tx = Math.min(Math.max(tx, 0), w);
        ty = Math.min(Math.max(ty, 0), h);
        ease = 0.018;
      }
      const ox = leader.x;
      const oy = leader.y;
      leader.x += (tx - leader.x) * Math.min(ease * dt, 1);
      leader.y += (ty - leader.y) * Math.min(ease * dt, 1);
      leader.vx = (leader.x - ox) / dt;
      leader.vy = (leader.y - oy) / dt;

      // --- Partikel asap ---
      const influence = b * 0.55;
      for (const p of particles) {
        p.age += dt;
        if (p.age >= p.maxLife) {
          spawn(p, false);
          continue;
        }

        // flow field: arah gerak asap berubah pelan oleh noise
        const a = noise(p.x * S + t * 0.0035, p.y * S - t * 0.0028) * TAU * 2;
        const fx = Math.cos(a) * 0.85;
        const fy = Math.sin(a) * 0.85 - 0.08; // sedikit naik seperti asap
        p.vx += (fx - p.vx) * 0.025 * dt;
        p.vy += (fy - p.vy) * 0.025 * dt;

        // titik pemimpin mempengaruhi asap di sekitarnya
        const dx = p.x - leader.x;
        const dy = p.y - leader.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < influence) {
          const f = 1 - d / influence;
          // terseret searah gerak pemimpin
          p.vx += leader.vx * f * 0.06 * dt;
          p.vy += leader.vy * f * 0.06 * dt;
          // berputar mengitari pemimpin
          p.vx += (-dy / d) * f * 0.05 * dt;
          p.vy += (dx / d) * f * 0.05 * dt;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = blend;

      for (const p of particles) {
        const k = p.age / p.maxLife;
        const fade = Math.sin(Math.PI * k); // muncul pelan, menghilang pelan
        const s = p.size * (0.75 + 0.5 * k); // asap membesar seiring waktu
        ctx.globalAlpha = Math.max(fade * p.alpha, 0);
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
      }

      // pendar halus di titik pemimpin
      const gs = base() * (pointer.current.inside ? 0.5 : 0.42);
      ctx.globalAlpha = 0.16 * intensity;
      ctx.drawImage(sprite, leader.x - gs / 2, leader.y - gs / 2, gs, gs);

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 16.667, 3);
      last = now;
      if (!inViewRef.current) return; // hemat CPU saat di luar layar
      step(dt);
      draw();
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
      // dpr 1 sudah cukup: asapnya memang lembut, dan jauh lebih ringan
      canvas.width = w;
      canvas.height = h;
      init();
      if (reduceMotion) {
        for (let i = 0; i < 120; i++) step(1);
        draw();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (!reduceMotion) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [color, intensity, blend, reduceMotion]);

  const setPointer = (clientX: number, clientY: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointer.current.x = clientX - rect.left;
    pointer.current.y = clientY - rect.top;
    pointer.current.inside = true;
  };

  return (
    <section
      ref={wrapRef}
      className={`relative overflow-hidden ${className}`}
      onPointerEnter={(e) => setPointer(e.clientX, e.clientY)}
      onPointerMove={(e) => setPointer(e.clientX, e.clientY)}
      onPointerLeave={() => (pointer.current.inside = false)}
    >
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
