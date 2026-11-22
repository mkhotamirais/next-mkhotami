"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type GalleryItem = {
  title: string;
  description?: string;
  /** Label kecil di atas judul, mis. "Langkah 1" atau "2026" */
  tag?: string;
  /** Gambar kartu. Kosong = gradien warna. */
  image?: string;
  /** Gradien CSS untuk kartu tanpa gambar */
  gradient?: string;
};

type HorizontalScrollGalleryProps = {
  items: GalleryItem[];
  /** Judul besar di awal galeri (opsional) */
  heading?: string;
  accent?: string;
  className?: string;
};

const GRADIENTS = [
  "linear-gradient(135deg, #f97316 0%, #7c2d12 100%)",
  "linear-gradient(135deg, #fb923c 0%, #be123c 100%)",
  "linear-gradient(135deg, #fbbf24 0%, #c2410c 100%)",
  "linear-gradient(135deg, #f43f5e 0%, #4c1d95 100%)",
  "linear-gradient(135deg, #fdba74 0%, #9a3412 100%)",
];

type CardProps = {
  item: GalleryItem;
  index: number;
  trackX: MotionValue<number>;
  layoutTick: MotionValue<number>;
  reduce: boolean;
};

function Card({ item, index, trackX, layoutTick, reduce }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Posisi tengah kartu relatif ke tengah layar: -1 (kiri) ... 0 (tengah) ... 1 (kanan)
  const n = useTransform([trackX, layoutTick], ([x]: number[]) => {
    const el = ref.current;
    if (!el) return 0;
    const center = el.offsetLeft + el.offsetWidth / 2 + x;
    return (center - window.innerWidth / 2) / window.innerWidth;
  });

  const k = reduce ? 0 : 1;
  const scale = useTransform(n, [-1, 0, 1], [0.86, 1, 0.86]);
  const rotateY = useTransform(n, [-1, 0, 1], [26 * k, 0, -26 * k]);
  const imageX = useTransform(n, [-1, 0, 1], [60 * k, 0, -60 * k]);
  const textX = useTransform(n, [-1, 0, 1], [-50 * k, 0, 50 * k]);

  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      style={{ scale, rotateY, transformPerspective: 1200 }}
      className="relative h-[68vh] w-[78vw] shrink-0 overflow-hidden rounded-3xl md:w-[42vw]"
    >
      {/* Gambar / gradien, sedikit lebih lebar dari kartu agar bisa bergeser (parallax) */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 -left-[12%] w-[124%]"
        style={{
          x: imageX,
          background: item.image ? undefined : (item.gradient ?? GRADIENTS[index % GRADIENTS.length]),
        }}
      >
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt="" draggable={false} className="h-full w-full select-none object-cover" />
        )}
      </motion.div>

      {/* Pelindung agar teks terbaca */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Angka besar di pojok */}
      <span
        aria-hidden
        className="absolute right-6 top-4 select-none text-7xl font-black leading-none text-white/20 md:text-8xl"
      >
        {number}
      </span>

      <motion.div style={{ x: textX }} className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
        {item.tag && <span className="text-xs font-semibold uppercase tracking-[0.25em] opacity-80">{item.tag}</span>}
        <h3 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">{item.title}</h3>
        {item.description && <p className="mt-3 max-w-md text-base opacity-80">{item.description}</p>}
      </motion.div>
    </motion.div>
  );
}

export default function HorizontalScrollGallery({
  items,
  heading,
  accent = "#f97316",
  className = "",
}: HorizontalScrollGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const [height, setHeight] = useState<number | null>(null);
  const maxX = useMotionValue(0); // jarak geser horizontal total (px)
  const layoutTick = useMotionValue(0); // dinaikkan tiap ukuran berubah

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.0005,
  });

  // Scroll vertikal -> geser horizontal
  const x = useTransform([progress, maxX], ([p, m]: number[]) => -p * m);

  // Ukur lebar track, lalu atur tinggi section = jarak geser + tinggi layar
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const dist = Math.max(track.scrollWidth - window.innerWidth, 0);
      maxX.set(dist);
      setHeight(dist + window.innerHeight);
      layoutTick.set(layoutTick.get() + 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length, heading, maxX, layoutTick]);

  return (
    <section ref={sectionRef} style={{ height: height ?? "300vh" }} className={`relative ${className}`}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative flex w-max shrink-0 items-center gap-6 px-[8vw] will-change-transform md:gap-10"
        >
          {heading && (
            <h2 className="w-[80vw] shrink-0 text-5xl font-black leading-[1.05] md:w-[34vw] md:text-7xl">{heading}</h2>
          )}
          {items.map((item, i) => (
            <Card key={i} item={item} index={i} trackX={x} layoutTick={layoutTick} reduce={reduceMotion} />
          ))}
        </motion.div>

        {/* Garis progres di bawah layar */}
        <div className="absolute inset-x-[8vw] bottom-8 h-[3px] rounded-full bg-current opacity-10" />
        <motion.div
          aria-hidden
          className="absolute inset-x-[8vw] bottom-8 h-[3px] origin-left rounded-full"
          style={{ scaleX: progress, backgroundColor: accent }}
        />
      </div>
    </section>
  );
}
