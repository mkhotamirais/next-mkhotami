"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import type { MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";

type VelocityMarqueeProps = {
  /** Satu string = satu baris. Arah baris bergantian kiri/kanan. */
  rows: string[];
  /** Kecepatan dasar: % lebar satu teks per detik. Makin besar makin cepat. */
  speed?: number;
  /** Pemisah antar teks */
  separator?: string;
  /** Jumlah salinan teks per baris. Naikkan kalau teksnya pendek dan ada celah kosong. */
  copies?: number;
  /** Warna pemisah dan garis luar */
  accent?: string;
  className?: string;
};

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

type RowProps = {
  text: string;
  separator: string;
  baseDirection: 1 | -1;
  speed: number;
  copies: number;
  accent: string;
  outlined: boolean;
  velocityFactor: MotionValue<number>;
  active: MutableRefObject<boolean>;
  reduce: boolean;
};

function MarqueeRow({
  text,
  separator,
  baseDirection,
  speed,
  copies,
  accent,
  outlined,
  velocityFactor,
  active,
  reduce,
}: RowProps) {
  const base = useMotionValue(0); // satuan: % lebar satu salinan
  const scrollDir = useRef(1); // berbalik saat scroll ke atas

  useAnimationFrame((_, delta) => {
    if (reduce || !active.current) return;
    const vf = velocityFactor.get();
    if (Math.abs(vf) > 0.05) scrollDir.current = vf > 0 ? 1 : -1;

    // Kecepatan dasar + tambahan dari kecepatan scroll
    const move = baseDirection * scrollDir.current * speed * (1 + Math.abs(vf)) * (delta / 1000);
    base.set(base.get() + move);
  });

  // Geser satu salinan penuh lalu mengulang tanpa terlihat putus
  const x = useTransform(base, (v) => `${wrap(-100, 0, v) / copies}%`);

  return (
    <motion.div style={{ x }} className="flex w-max whitespace-nowrap">
      {Array.from({ length: copies }).map((_, i) => (
        <span key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
          <span
            className="text-6xl font-black uppercase leading-none tracking-tight md:text-8xl lg:text-9xl"
            style={
              outlined
                ? {
                    WebkitTextFillColor: "transparent",
                    WebkitTextStroke: `2px ${accent}`,
                  }
                : undefined
            }
          >
            {text}
          </span>
          <span className="mx-6 text-4xl md:mx-10 md:text-6xl" style={{ color: accent }}>
            {separator}
          </span>
        </span>
      ))}
    </motion.div>
  );
}

export default function VelocityMarquee({
  rows,
  speed = 8,
  separator = "✦",
  copies = 6,
  accent = "#f97316",
  className = "",
}: VelocityMarqueeProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  // Pause saat di luar layar
  const inView = useInView(ref);
  const active = useRef(false);
  useEffect(() => {
    active.current = inView;
  });

  // Kecepatan scroll halaman -> faktor percepatan + kemiringan
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smooth, [0, 1000], [0, 5]);
  const tilt = reduceMotion ? 0 : 10;
  const skewX = useTransform(smooth, [-2000, 0, 2000], [tilt, 0, -tilt], {
    clamp: true,
  });

  return (
    <section ref={ref} className={`overflow-hidden py-10 ${className}`}>
      <motion.div style={{ skewX }} className="flex flex-col gap-4 md:gap-6">
        {rows.map((text, i) => (
          <MarqueeRow
            key={i}
            text={text}
            separator={separator}
            baseDirection={i % 2 === 0 ? -1 : 1}
            speed={speed}
            copies={copies}
            accent={accent}
            outlined={i % 2 === 1}
            velocityFactor={velocityFactor}
            active={active}
            reduce={reduceMotion}
          />
        ))}
      </motion.div>
    </section>
  );
}
