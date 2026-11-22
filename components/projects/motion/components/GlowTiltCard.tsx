"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";

type GlowTiltCardProps = {
  children: ReactNode;
  /** Kemiringan maksimum (derajat) */
  maxTilt?: number;
  /** Warna cahaya dalam format "r, g, b". Default oren. */
  glowColor?: string;
  /** Kelas untuk kartu luar (ukuran, margin, dll) */
  className?: string;
  /** Kelas untuk permukaan kartu (background, padding) */
  contentClassName?: string;
};

export default function GlowTiltCard({
  children,
  maxTilt = 12,
  glowColor = "249, 115, 22",
  className = "",
  contentClassName = "bg-neutral-950 p-8 text-white",
}: GlowTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const tilt = reduceMotion ? 0 : maxTilt;
  const shift = reduceMotion ? 0 : 8;

  // Posisi kursor di dalam kartu (0 - 1) dan status hover
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const spring = { stiffness: 220, damping: 22, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const sh = useSpring(hover, { stiffness: 140, damping: 24 });

  // Kemiringan 3D: sisi yang didekati kursor "tenggelam"
  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt]);
  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt]);

  // Isi kartu bergeser tipis berlawanan arah, memberi kesan kedalaman
  const contentX = useTransform(sx, [0, 1], [shift, -shift]);
  const contentY = useTransform(sy, [0, 1], [shift, -shift]);

  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);

  const border = useMotionTemplate`radial-gradient(320px circle at ${gx} ${gy}, rgba(${glowColor}, 0.95), transparent 65%)`;
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, rgba(${glowColor}, 0.18), transparent 60%)`;
  const glare = useMotionTemplate`radial-gradient(260px circle at ${gx} ${gy}, rgba(255, 255, 255, 0.1), transparent 70%)`;

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    hover.set(0);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={(e) => e.pointerType !== "touch" && hover.set(1)}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`relative rounded-2xl bg-white/10 p-px will-change-transform ${className}`}
    >
      {/* Cincin cahaya di tepi kartu */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ background: border, opacity: sh }}
      />

      {/* Permukaan kartu */}
      <div className="relative h-full overflow-hidden rounded-[15px]">
        <div className={`relative h-full ${contentClassName}`}>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: spotlight, opacity: sh }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: glare, opacity: sh }}
          />
          <motion.div className="relative z-10" style={{ x: contentX, y: contentY }}>
            {children}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
