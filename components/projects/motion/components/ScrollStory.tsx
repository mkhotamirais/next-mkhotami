"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";

export type StoryStep = {
  /** Judul langkah */
  title: string;
  /** Penjelasan langkah */
  description: string;
  /** Label pendek di rel progres (default: title) */
  label?: string;
  /** Visual di sisi kanan (gambar, ilustrasi, mockup). Kosong = angka besar. */
  visual?: ReactNode;
};

type ScrollStoryProps = {
  steps: StoryStep[];
  /** Panjang scroll per langkah. Makin besar = makin lambat/panjang. */
  heightPerStep?: string;
  /** Warna aksen */
  accent?: string;
  className?: string;
};

type PanelProps = {
  step: StoryStep;
  index: number;
  total: number;
  progress: MotionValue<number>;
  accent: string;
  reduce: boolean;
};

function StepPanel({ step, index, total, progress, accent, reduce }: PanelProps) {
  const seg = 1 / total;
  const start = index * seg;
  const end = start + seg;
  const f = seg * 0.22; // lamanya transisi masuk/keluar
  const d = reduce ? 0 : 48; // jarak geser vertikal

  // Langkah pertama sudah tampil di awal, langkah terakhir tetap tampil di akhir
  let inputs: number[];
  let opacityOut: number[];
  let yOut: number[];
  let scaleOut: number[];
  if (total === 1) {
    inputs = [0, 1];
    opacityOut = [1, 1];
    yOut = [0, 0];
    scaleOut = [1, 1];
  } else if (index === 0) {
    inputs = [0, end - f, end];
    opacityOut = [1, 1, 0];
    yOut = [0, 0, -d];
    scaleOut = [1, 1, 1.04];
  } else if (index === total - 1) {
    inputs = [start, start + f, 1];
    opacityOut = [0, 1, 1];
    yOut = [d, 0, 0];
    scaleOut = [0.94, 1, 1];
  } else {
    inputs = [start, start + f, end - f, end];
    opacityOut = [0, 1, 1, 0];
    yOut = [d, 0, 0, -d];
    scaleOut = [0.94, 1, 1, 1.04];
  }

  const opacity = useTransform(progress, inputs, opacityOut);
  const y = useTransform(progress, inputs, yOut);
  const scale = useTransform(progress, inputs, scaleOut);
  const pointerEvents = useTransform(opacity, (v) => (v > 0.5 ? "auto" : "none"));

  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      style={{ opacity, y, pointerEvents }}
      className="col-start-1 row-start-1 grid items-center gap-10 lg:grid-cols-2"
    >
      <div>
        <span className="text-sm font-semibold tracking-[0.25em]" style={{ color: accent }}>
          LANGKAH {number}
        </span>
        <h3 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{step.title}</h3>
        <p className="mt-5 max-w-lg text-lg leading-relaxed opacity-70">{step.description}</p>
      </div>

      <motion.div style={{ scale }} className="flex items-center justify-center">
        {step.visual ?? (
          <span
            aria-hidden
            className="select-none text-[9rem] font-black leading-none md:text-[14rem]"
            style={{ color: "transparent", WebkitTextStroke: `2px ${accent}` }}
          >
            {number}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}

type RailItemProps = {
  label: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  accent: string;
};

function RailItem({ label, index, total, progress, accent }: RailItemProps) {
  const start = index / total;
  const active = useTransform(progress, [start - 0.02, start + 0.005], [0, 1], {
    clamp: true,
  });
  const dotScale = useTransform(active, [0, 1], [0.5, 1]);
  const labelOpacity = useTransform(active, [0, 1], [0.35, 1]);
  const top = total === 1 ? 0 : (index / (total - 1)) * 100;

  return (
    <div className="absolute left-0 flex -translate-y-1/2 items-center gap-4" style={{ top: `${top}%` }}>
      <span className="relative block h-4 w-4 rounded-full border-2 border-current opacity-25">
        <span className="sr-only">{label}</span>
      </span>
      <motion.span
        aria-hidden
        className="absolute left-0 block h-4 w-4 rounded-full"
        style={{ opacity: active, scale: dotScale, backgroundColor: accent }}
      />
      <motion.span style={{ opacity: labelOpacity }} className="hidden whitespace-nowrap text-sm font-medium md:block">
        {label}
      </motion.span>
    </div>
  );
}

export default function ScrollStory({
  steps,
  heightPerStep = "130vh",
  accent = "#f97316",
  className = "",
}: ScrollStoryProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const total = steps.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.0005,
  });
  const progress = smooth;

  // Garis rel terisi sampai titik terakhir saat langkah terakhir dimulai
  const railFill = useTransform(progress, [0, total > 1 ? (total - 1) / total : 1], [0, 1], { clamp: true });
  const railFillStatic = useMotionValue(1);

  if (total === 0) return null;

  return (
    <section ref={ref} style={{ height: `calc(${total} * ${heightPerStep})` }} className={`relative ${className}`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="mx-auto flex h-full max-w-6xl items-center gap-10 px-6 md:gap-16">
          {/* Rel progres */}
          <div className="relative h-[60vh] w-4 shrink-0 md:w-40">
            <div className="absolute bottom-0 left-[7px] top-0 w-[2px] bg-current opacity-15" />
            <motion.div
              className="absolute bottom-0 left-[7px] top-0 w-[2px] origin-top"
              style={{
                scaleY: reduceMotion ? railFillStatic : railFill,
                backgroundColor: accent,
              }}
            />
            {steps.map((s, i) => (
              <RailItem
                key={i}
                label={s.label ?? s.title}
                index={i}
                total={total}
                progress={progress}
                accent={accent}
              />
            ))}
          </div>

          {/* Isi langkah: semua ditumpuk di sel yang sama, tampil bergantian */}
          <div className="grid flex-1 items-center">
            {steps.map((s, i) => (
              <StepPanel
                key={i}
                step={s}
                index={i}
                total={total}
                progress={progress}
                accent={accent}
                reduce={reduceMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
