"use client";

import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject, PointerEvent, ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Dasar bersama untuk background berbasis canvas                      */
/* ------------------------------------------------------------------ */

const TAU = Math.PI * 2;
const DEFAULT_CLASS = "min-h-[560px] bg-black";

type Pointer = { x: number; y: number; inside: boolean };
type Scene = {
  resize: (w: number, h: number) => void;
  frame: (dt: number, t: number) => void;
};
type SceneFactory = (ctx: CanvasRenderingContext2D, pointer: MutableRefObject<Pointer>) => Scene;

type ShellProps = { className?: string; children?: ReactNode };

// Sprite cahaya: lingkaran gradien lembut yang dipakai berulang (jauh lebih ringan dari shadowBlur)
function glowSprite(rgb: string, size = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gr.addColorStop(0, `rgba(${rgb}, 1)`);
  gr.addColorStop(0.25, `rgba(${rgb}, 0.55)`);
  gr.addColorStop(1, `rgba(${rgb}, 0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, size, size);
  return c;
}

function CanvasBackground({ scene, className = DEFAULT_CLASS, children }: ShellProps & { scene: SceneFactory }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, inside: false });

  const inView = useInView(wrapRef);
  const inViewRef = useRef(false);
  useEffect(() => {
    inViewRef.current = inView;
  });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const s = scene(ctx, pointer);
    let raf = 0;
    let last = performance.now();
    let t = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.resize(rect.width, rect.height);
      if (reduceMotion) s.frame(0, 0); // gambar statis
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 16.667, 3);
      last = now;
      if (!inViewRef.current) return; // hemat CPU saat di luar layar
      t += dt;
      s.frame(dt, t);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    if (!reduceMotion) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [scene, reduceMotion]);

  const setPointer = (e: PointerEvent<HTMLDivElement>, inside = true) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointer.current.x = e.clientX - rect.left;
    pointer.current.y = e.clientY - rect.top;
    pointer.current.inside = inside;
  };

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className}`}
      onPointerEnter={(e) => setPointer(e)}
      onPointerMove={(e) => setPointer(e)}
      onPointerLeave={(e) => setPointer(e, false)}
    >
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1. SparklesBackground: bintang berkilau, menyala saat didekati       */
/* ------------------------------------------------------------------ */

type SparklesProps = ShellProps & {
  /** Daftar warna "r, g, b" yang dipakai acak */
  colors?: string[];
  /** Kepadatan bintang. 1 = normal. */
  density?: number;
};

export function SparklesBackground({
  colors = ["255, 255, 255", "253, 186, 116", "251, 146, 60"],
  density = 1,
  className,
  children,
}: SparklesProps) {
  const key = colors.join("|");

  const scene = useMemo<SceneFactory>(
    () => (ctx, pointer) => {
      const sprites = colors.map((c) => glowSprite(c));
      type Star = {
        x: number;
        y: number;
        r: number;
        phase: number;
        speed: number;
        c: number;
        drift: number;
      };
      let stars: Star[] = [];
      let w = 0;
      let h = 0;

      return {
        resize(nw, nh) {
          w = nw;
          h = nh;
          const n = Math.round(Math.min(Math.max(((w * h) / 2500) * density, 60), 700));
          stars = Array.from({ length: n }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 0.4 + Math.random() ** 2 * 2.2,
            phase: Math.random() * TAU,
            speed: 0.02 + Math.random() * 0.05,
            c: Math.floor(Math.random() * colors.length),
            drift: 0.05 + Math.random() * 0.15,
          }));
        },
        frame(dt, t) {
          ctx.clearRect(0, 0, w, h);
          ctx.globalCompositeOperation = "lighter";
          const { x: px, y: py, inside } = pointer.current;

          for (const s of stars) {
            // melayang pelan ke atas
            s.y -= s.drift * dt * 0.3;
            if (s.y < -6) {
              s.y = h + 6;
              s.x = Math.random() * w;
            }

            const tw = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase); // 0..1
            let boost = 0;
            if (inside) {
              const dx = s.x - px;
              const dy = s.y - py;
              const d2 = dx * dx + dy * dy;
              if (d2 < 22500) boost = 1 - Math.sqrt(d2) / 150;
            }

            const a = Math.min(0.25 + tw * 0.75 + boost, 1);
            const halo = s.r * (1 + boost * 2.2) * (0.7 + tw * 0.6) * 6;

            ctx.globalAlpha = a * 0.9;
            ctx.drawImage(sprites[s.c], s.x - halo / 2, s.y - halo / 2, halo, halo);

            ctx.globalAlpha = a;
            ctx.fillStyle = `rgb(${colors[s.c]})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r * 0.6 * (1 + boost), 0, TAU);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "source-over";
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, density],
  );

  return (
    <CanvasBackground scene={scene} className={className}>
      {children}
    </CanvasBackground>
  );
}

/* ------------------------------------------------------------------ */
/*  2. FirefliesBackground: banyak cahaya melayang, mengitari kursor     */
/* ------------------------------------------------------------------ */

type FirefliesProps = ShellProps & {
  colors?: string[];
  density?: number;
};

export function FirefliesBackground({
  colors = ["253, 224, 71", "251, 146, 60", "163, 230, 53"],
  density = 1,
  className,
  children,
}: FirefliesProps) {
  const key = colors.join("|");

  const scene = useMemo<SceneFactory>(
    () => (ctx, pointer) => {
      const sprites = colors.map((c) => glowSprite(c, 96));
      type Fly = {
        x: number;
        y: number;
        vx: number;
        vy: number;
        a: number;
        sp: number;
        r: number;
        phase: number;
        ps: number;
        c: number;
      };
      let flies: Fly[] = [];
      let w = 0;
      let h = 0;

      return {
        resize(nw, nh) {
          w = nw;
          h = nh;
          const n = Math.round(Math.min(Math.max(((w * h) / 18000) * density, 20), 90));
          flies = Array.from({ length: n }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: 0,
            vy: 0,
            a: Math.random() * TAU,
            sp: 0.25 + Math.random() * 0.5,
            r: 12 + Math.random() * 26,
            phase: Math.random() * TAU,
            ps: 0.015 + Math.random() * 0.03,
            c: Math.floor(Math.random() * colors.length),
          }));
        },
        frame(dt, t) {
          ctx.clearRect(0, 0, w, h);
          ctx.globalCompositeOperation = "lighter";
          const { x: px, y: py, inside } = pointer.current;

          for (const f of flies) {
            // arah jelajah berubah pelan-pelan secara acak
            f.a += (Math.random() - 0.5) * 0.12 * dt;
            const wx = Math.cos(f.a) * f.sp;
            const wy = Math.sin(f.a) * f.sp;
            f.vx += (wx - f.vx) * 0.04 * dt;
            f.vy += (wy - f.vy) * 0.04 * dt;

            // tertarik ke kursor, lalu berputar mengitarinya
            if (inside) {
              const dx = px - f.x;
              const dy = py - f.y;
              const d = Math.sqrt(dx * dx + dy * dy) || 1;
              if (d < 340) {
                const k = (d < 70 ? -0.08 : 0.05) * (1 - d / 340) * dt;
                f.vx += (dx / d) * k - (dy / d) * k * 0.6;
                f.vy += (dy / d) * k + (dx / d) * k * 0.6;
              }
            }

            f.x += f.vx * dt;
            f.y += f.vy * dt;
            if (f.x < -40) f.x = w + 40;
            else if (f.x > w + 40) f.x = -40;
            if (f.y < -40) f.y = h + 40;
            else if (f.y > h + 40) f.y = -40;

            const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * f.ps + f.phase));
            const size = f.r * 2 * (0.8 + 0.4 * pulse);

            ctx.globalAlpha = pulse * 0.85;
            ctx.drawImage(sprites[f.c], f.x - size / 2, f.y - size / 2, size, size);

            ctx.globalAlpha = pulse;
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(f.x, f.y, 1.4, 0, TAU);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "source-over";
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, density],
  );

  return (
    <CanvasBackground scene={scene} className={className}>
      {children}
    </CanvasBackground>
  );
}

/* ------------------------------------------------------------------ */
/*  3. GlowGridBackground: grid titik yang menyala di dekat kursor       */
/* ------------------------------------------------------------------ */

type GlowGridProps = ShellProps & {
  /** Warna nyala "r, g, b" */
  color?: string;
  /** Jarak antar titik (px) */
  gap?: number;
  /** Jangkauan cahaya kursor (px) */
  radius?: number;
};

export function GlowGridBackground({
  color = "249, 115, 22",
  gap = 28,
  radius = 190,
  className,
  children,
}: GlowGridProps) {
  const scene = useMemo<SceneFactory>(
    () => (ctx, pointer) => {
      let w = 0;
      let h = 0;
      let cols = 0;
      let rows = 0;
      let level = new Float32Array(0);

      return {
        resize(nw, nh) {
          w = nw;
          h = nh;
          cols = Math.ceil(w / gap) + 1;
          rows = Math.ceil(h / gap) + 1;
          level = new Float32Array(cols * rows);
        },
        frame(dt, t) {
          ctx.clearRect(0, 0, w, h);

          // Tanpa kursor, "cahaya" mengembara sendiri supaya tetap hidup
          let px: number;
          let py: number;
          if (pointer.current.inside) {
            px = pointer.current.x;
            py = pointer.current.y;
          } else {
            px = w * (0.5 + 0.35 * Math.sin(t * 0.006));
            py = h * (0.5 + 0.3 * Math.sin(t * 0.0043 + 1));
          }

          // Lapisan 1: semua titik dasar dalam satu path (hemat)
          ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
          ctx.beginPath();
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              ctx.rect(c * gap - 0.75, r * gap - 0.75, 1.5, 1.5);
            }
          }
          ctx.fill();

          // Lapisan 2: titik yang menyala, naik turun halus
          const ease = Math.min(0.12 * dt, 1);
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const x = c * gap;
              const y = r * gap;
              const d = Math.hypot(x - px, y - py);
              const target = d < radius ? (1 - d / radius) ** 2 : 0;
              const i = r * cols + c;
              level[i] += (target - level[i]) * ease;
              const l = level[i];
              if (l < 0.02) continue;
              ctx.fillStyle = `rgba(${color}, ${Math.min(0.15 + l * 0.85, 1)})`;
              ctx.beginPath();
              ctx.arc(x, y, 1 + l * 2.4, 0, TAU);
              ctx.fill();
            }
          }
        },
      };
    },
    [color, gap, radius],
  );

  return (
    <CanvasBackground scene={scene} className={className}>
      {children}
    </CanvasBackground>
  );
}

/* ------------------------------------------------------------------ */
/*  4. AuroraBackground: gumpalan warna lembut seperti cahaya kutub      */
/* ------------------------------------------------------------------ */

type AuroraProps = ShellProps & {
  /** Warna hex untuk tiap gumpalan */
  colors?: string[];
  /** Satu gumpalan ekstra yang mengikuti kursor */
  follow?: boolean;
};

export function AuroraBackground({
  colors = ["#f97316", "#ec4899", "#8b5cf6"],
  follow = true,
  className = DEFAULT_CLASS,
  children,
}: AuroraProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const hover = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const sh = useSpring(hover, { stiffness: 80, damping: 20 });

  const update = (e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onPointerEnter={(e) => {
        update(e);
        sx.jump(mx.get());
        sy.jump(my.get());
        hover.set(1);
      }}
      onPointerMove={update}
      onPointerLeave={() => hover.set(0)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {colors.map((c, i) => (
          <motion.div
            key={`${c}-${i}`}
            className="absolute rounded-full mix-blend-screen blur-3xl"
            style={{
              background: c,
              width: "45vmax",
              height: "45vmax",
              left: `${5 + i * 28}%`,
              top: `${(i % 2) * 35}%`,
              opacity: 0.4,
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, 140, -90, 0],
                    y: [0, -100, 80, 0],
                    scale: [1, 1.25, 0.9, 1],
                  }
            }
            transition={{
              duration: 18 + i * 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {follow && (
          <motion.div className="absolute left-0 top-0" style={{ x: sx, y: sy, opacity: sh }}>
            <div
              className="-translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen blur-3xl"
              style={{
                width: "26vmax",
                height: "26vmax",
                background: colors[0],
                opacity: 0.55,
              }}
            />
          </motion.div>
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
