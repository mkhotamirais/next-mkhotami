"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import { useRef } from "react";

type ScrollWaveRevealProps = {
  /** Tulisan yang muncul kata demi kata saat scroll */
  text: string;
  /** Panjang area scroll. Makin besar = animasi makin lambat. */
  scrollHeight?: string;
  /** Warna garis utama */
  lineColor?: string;
  /** Warna garis kedua (lebih tipis) */
  lineColor2?: string;
  /** Tebal garis utama (satuan viewBox) */
  strokeWidth?: number;
  className?: string;
};

// Garis meliuk dari atas ke bawah, bolak-balik kanan-kiri
const WAVE = "M 520 -20 C 1000 60, 1000 200, 520 260 C 40 320, 40 460, 520 520 C 1000 580, 1000 700, 520 760";

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const y = useTransform(progress, range, [16, 0]);
  const blur = useTransform(progress, range, [6, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.span style={{ opacity, y, filter }} className="inline-block">
      {word}
    </motion.span>
  );
}

export default function ScrollWaveReveal({
  text,
  scrollHeight = "300vh",
  lineColor = "#f97316",
  lineColor2 = "#fdba74",
  strokeWidth = 7,
  className = "",
}: ScrollWaveRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // 0 saat section mulai menempel, 1 saat selesai
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.0005,
  });
  const full = useMotionValue(1);
  const progress = reduceMotion ? full : smooth;

  // Garis selesai tergambar sedikit sebelum scroll berakhir
  const length1 = useTransform(progress, [0, 0.9], [0, 1], { clamp: true });
  const length2 = useTransform(progress, [0.08, 0.95], [0, 1], { clamp: true });

  const words = text.split(" ");

  return (
    <section ref={ref} style={{ height: scrollHeight }} className={`relative ${className}`}>
      {/* Layar yang menempel selama scroll berlangsung */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <svg
          aria-hidden
          viewBox="0 0 1000 740"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          {/* Jalur samar sebagai "rel" */}
          <path d={WAVE} stroke={lineColor} strokeOpacity={0.1} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Garis kedua, lebih tipis dan sedikit tertinggal */}
          <motion.path
            d={WAVE}
            transform="translate(-70 0)"
            stroke={lineColor2}
            strokeOpacity={0.6}
            strokeWidth={strokeWidth * 0.45}
            strokeLinecap="round"
            style={{ pathLength: length2 }}
          />
          {/* Garis utama */}
          <motion.path
            d={WAVE}
            stroke={lineColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ pathLength: length1 }}
          />
        </svg>

        <p className="relative z-10 mx-auto flex max-w-3xl flex-wrap justify-center gap-x-[0.28em] px-6 text-center text-4xl font-bold leading-tight md:text-6xl">
          {words.map((word, i) => {
            // Kata muncul bertahap di rentang scroll 5% - 80%
            const start = 0.05 + (i / words.length) * 0.75;
            const end = start + 0.75 / words.length + 0.06;
            return <Word key={`${word}-${i}`} word={word} range={[start, Math.min(end, 0.85)]} progress={progress} />;
          })}
        </p>
      </div>
    </section>
  );
}
