"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type Particle = {
  ox: number; // posisi asal (membentuk gambar)
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
};

type DotImageRepelProps = {
  /** Gambar sumber. Kosong = bentuk lingkaran oren bawaan. */
  src?: string;
  /** Jarak antar titik (px). Makin kecil = makin rapat, makin berat. */
  gap?: number;
  /** Diameter titik (px) */
  dotSize?: number;
  /** Jarak pengaruh kursor (px) */
  radius?: number;
  /** Kekuatan dorongan kursor */
  strength?: number;
  /** Paksa semua titik satu warna. Kosong = ambil warna dari gambar. */
  color?: string;
  /** Abaikan piksel putih (berguna untuk JPG berlatar putih) */
  ignoreWhite?: boolean;
  /** Atur ukuran lewat className, mis. "h-[420px] w-full" */
  className?: string;
};

export default function DotImageRepel({
  src,
  gap = 7,
  dotSize = 2.6,
  radius = 110,
  strength = 1,
  color,
  ignoreWhite = false,
  className = "h-[420px] w-full",
}: DotImageRepelProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -9999, y: -9999 });

  const inView = useInView(wrapRef);
  const inViewRef = useRef(false);
  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let cancelled = false;
    let img: HTMLImageElement | null = null;

    const SPRING = 0.07; // tarikan balik ke posisi asal
    const FRICTION = 0.82; // redaman
    const PUSH = 5 * strength; // dorongan kursor

    // Ambil titik-titik dari gambar
    const build = () => {
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;

      if (img) {
        // object-contain: gambar muat penuh dan di tengah
        const scale = Math.min(width / img.width, height / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        octx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
      } else {
        const r = Math.min(width, height) * 0.38;
        const g = octx.createRadialGradient(
          width / 2 - r * 0.3,
          height / 2 - r * 0.3,
          r * 0.1,
          width / 2,
          height / 2,
          r,
        );
        g.addColorStop(0, "#fdba74");
        g.addColorStop(0.6, "#f97316");
        g.addColorStop(1, "#ea580c");
        octx.fillStyle = g;
        octx.beginPath();
        octx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
        octx.fill();
      }

      let data: Uint8ClampedArray;
      try {
        data = octx.getImageData(0, 0, width, height).data;
      } catch {
        // Gambar lintas-domain tanpa CORS: pakai file di /public atau aktifkan CORS
        console.warn("DotImageRepel: gambar tidak bisa dibaca (CORS).");
        return;
      }

      const next: Particle[] = [];
      for (let py = 0; py < height; py += gap) {
        for (let px = 0; px < width; px += gap) {
          const i = (Math.floor(py) * width + Math.floor(px)) * 4;
          const a = data[i + 3];
          if (a < 128) continue;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (ignoreWhite && r > 235 && g > 235 && b > 235) continue;
          next.push({
            ox: px,
            oy: py,
            // mulai dari posisi acak, lalu "berkumpul" membentuk gambar
            x: reduceMotion ? px : Math.random() * width,
            y: reduceMotion ? py : Math.random() * height,
            vx: 0,
            vy: 0,
            color: color ?? `rgb(${r},${g},${b})`,
          });
        }
      }
      particles = next;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!inViewRef.current) return; // hemat CPU saat di luar layar

      ctx.clearRect(0, 0, width, height);
      const { x: mx, y: my } = pointer.current;
      const r2 = radius * radius;

      for (const p of particles) {
        if (!reduceMotion) {
          // 1) Tolak kursor
          const dx = p.x - mx;
          const dy = p.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = (1 - d / radius) ** 2 * PUSH;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }

          // 2) Tarik balik ke posisi asal
          p.vx += (p.ox - p.x) * SPRING;
          p.vy += (p.oy - p.y) * SPRING;

          // 3) Redaman lalu gerak
          p.vx *= FRICTION;
          p.vy *= FRICTION;
          p.x += p.vx;
          p.y += p.vy;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      build();
    };

    const start = () => {
      if (cancelled) return;
      resize();
      raf = requestAnimationFrame(tick);
    };

    if (src) {
      img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = start;
      img.onerror = () => {
        img = null; // gagal load -> pakai bentuk bawaan
        start();
      };
      img.src = src;
    } else {
      start();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [src, gap, dotSize, radius, strength, color, ignoreWhite, reduceMotion]);

  const setPointer = (clientX: number, clientY: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointer.current = { x: clientX - rect.left, y: clientY - rect.top };
  };

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      onPointerMove={(e) => setPointer(e.clientX, e.clientY)}
      onPointerLeave={() => (pointer.current = { x: -9999, y: -9999 })}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
