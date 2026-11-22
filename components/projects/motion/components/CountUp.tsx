"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";

type CountUpProps = {
  /** Angka tujuan */
  to: number;
  /** Angka awal */
  from?: number;
  /** Lama animasi (detik) */
  duration?: number;
  /** Jumlah angka di belakang koma */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Format angka. "id-ID" -> 1.250.000, "en-US" -> 1,250,000 */
  locale?: string;
  /** true = hanya sekali; false = ulang setiap masuk layar */
  once?: boolean;
  className?: string;
};

export default function CountUp({
  to,
  from = 0,
  duration = 1.5,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "id-ID",
  once = true,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "0px 0px -80px 0px" });
  const reduceMotion = useReducedMotion();

  const format = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [locale, decimals],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = (v: number) => {
      el.textContent = `${prefix}${format.format(v)}${suffix}`;
    };

    if (!inView) {
      render(from);
      return;
    }
    if (reduceMotion) {
      render(to);
      return;
    }

    // ease expo-out: ngebut di awal, melambat di akhir
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: render,
    });
    return () => controls.stop();
  }, [inView, to, from, duration, reduceMotion, format, prefix, suffix]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {format.format(from)}
      {suffix}
    </span>
  );
}
