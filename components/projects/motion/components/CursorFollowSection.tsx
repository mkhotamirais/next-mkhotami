"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";

type CursorFollowSectionProps = {
  /** Gambar oren (PNG/WebP transparan paling bagus). Kosong = blob oren bawaan. */
  src?: string;
  alt?: string;
  /** Ukuran gambar dalam px */
  size?: number;
  className?: string;
  children?: ReactNode;
};

export default function CursorFollowSection({
  src,
  alt = "",
  size = 220,
  className = "",
  children,
}: CursorFollowSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);

  // Posisi target (langsung mengikuti kursor)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Posisi yang dirender (di-smooth pakai spring, jadi terasa "tertinggal")
  const springX = useSpring(x, { stiffness: 140, damping: 16, mass: 0.7 });
  const springY = useSpring(y, { stiffness: 140, damping: 16, mass: 0.7 });

  // Miring mengikuti kecepatan horizontal
  const velocityX = useVelocity(springX);
  const rawRotate = useTransform(velocityX, [-1800, 0, 1800], [-20, 0, 20], {
    clamp: true,
  });
  const rotate = useSpring(rawRotate, { stiffness: 200, damping: 20 });

  // Posisi awal/istirahat: tengah section
  const getCenter = () => {
    const rect = ref.current?.getBoundingClientRect();
    return {
      x: (rect?.width ?? 0) / 2 - size / 2,
      y: (rect?.height ?? 0) / 2 - size / 2,
    };
  };

  useEffect(() => {
    const c = getCenter();
    x.jump(c.x);
    y.jump(c.y);
    springX.jump(c.x);
    springY.jump(c.y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const handleMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch" || reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - size / 2);
    y.set(e.clientY - rect.top - size / 2);
  };

  const handleLeave = () => {
    setActive(false);
    const c = getCenter();
    x.set(c.x);
    y.set(c.y);
  };

  return (
    <section
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={handleLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Elemen yang mengikuti kursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0"
        style={{ x: springX, y: springY, rotate, width: size, height: size }}
        animate={{ scale: active ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="h-full w-full select-none object-contain drop-shadow-[0_20px_40px_rgba(249,115,22,0.45)]"
          />
        ) : (
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_30%_30%,#fdba74,#f97316_55%,#ea580c)] shadow-[0_20px_60px_rgba(249,115,22,0.5)]" />
        )}
      </motion.div>

      {/* Konten section */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
