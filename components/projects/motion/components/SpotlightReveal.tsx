"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";

type SpotlightRevealProps = {
  /** Lapisan bawah, selalu terlihat */
  base: ReactNode;
  /** Lapisan atas, hanya terlihat di dalam lingkaran sorotan. Susunannya sebaiknya sama dengan `base`. */
  reveal: ReactNode;
  /** Jari-jari lingkaran sorotan (px) */
  radius?: number;
  /** Warna garis cincin di tepi lingkaran. Isi "transparent" untuk menyembunyikan. */
  ringColor?: string;
  /** Kelas wrapper (background lapisan bawah, tinggi minimum, dll) */
  className?: string;
  /** Kelas untuk KEDUA lapisan (padding, alignment) supaya posisinya persis sama */
  contentClassName?: string;
  /** Kelas tambahan khusus lapisan atas (mis. background berbeda) */
  revealClassName?: string;
};

export default function SpotlightReveal({
  base,
  reveal,
  radius = 170,
  ringColor = "rgba(249, 115, 22, 0.5)",
  className = "",
  contentClassName = "",
  revealClassName = "",
}: SpotlightRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const sx = useSpring(mx, { stiffness: 320, damping: 32, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 320, damping: 32, mass: 0.4 });

  // Lingkaran membesar saat kursor masuk, mengecil saat keluar
  const size = useSpring(0, { stiffness: 190, damping: 20 });
  const safeSize = useTransform(size, (v) => Math.max(v, 0.01));

  // Tepi lingkaran dibuat lembut (feather)
  const mask = useMotionTemplate`radial-gradient(circle ${safeSize}px at ${sx}px ${sy}px, #000 0%, #000 60%, transparent 100%)`;

  // Cincin tipis di sekeliling lingkaran
  const ringX = useTransform([sx, size], ([x, s]: number[]) => x - s);
  const ringY = useTransform([sy, size], ([y, s]: number[]) => y - s);
  const ringD = useTransform(size, (s) => Math.max(s * 2, 0));

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
        // saat pertama masuk, langsung lompat ke posisi kursor tanpa meluncur
        sx.jump(mx.get());
        sy.jump(my.get());
        size.set(radius);
      }}
      onPointerMove={update}
      onPointerLeave={() => size.set(0)}
    >
      {/* Lapisan bawah */}
      <div className={contentClassName}>{base}</div>

      {/* Lapisan atas: hanya tampak lewat lubang lingkaran */}
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${contentClassName} ${revealClassName}`}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {reveal}
      </motion.div>

      {/* Cincin */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          width: ringD,
          height: ringD,
          borderColor: ringColor,
        }}
      />
    </div>
  );
}
