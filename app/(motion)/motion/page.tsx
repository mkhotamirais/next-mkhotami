import CountUp from "@/components/projects/motion/components/CountUp";
import CursorFollowSection from "@/components/projects/motion/components/CursorFollowSection";
import DotImageRepel from "@/components/projects/motion/components/DotImageRepel";
import GlowTiltCard from "@/components/projects/motion/components/GlowTiltCard";
import HorizontalScrollGallery from "@/components/projects/motion/components/HorizontalScrollgallery";
import {
  AuroraBackground,
  FirefliesBackground,
  GlowGridBackground,
  SparklesBackground,
} from "@/components/projects/motion/components/MagicBackgrounds";
// import First from "@/components/projects/motion/components/First";
// import Motion1 from "@/components/projects/motion/components/Motion1";
// import ScrollAnimation from "@/components/projects/motion/components/ScrollAnimation";
import ScrollStory from "@/components/projects/motion/components/ScrollStory";
import ScrollWaveReveal from "@/components/projects/motion/components/ScrollWaveReveal";
import SmokeSection from "@/components/projects/motion/components/SmokeSection";
import SpotlightReveal from "@/components/projects/motion/components/SpotlightReveal";
import VelocityMarquee from "@/components/projects/motion/components/VelocityMarquee";
import React from "react";

const steps = [
  {
    title: "Daftar dan pilih campaign",
    description: "Buat akun, lalu pilih campaign yang cocok dengan niche kamu.",
  },
  {
    title: "Buat dan upload konten",
    description: "Edit klip sesuai brief, lalu posting di akun kamu.",
  },
  {
    title: "Views dihitung otomatis",
    description: "Sistem melacak tayangan setiap klip secara real-time.",
  },
  {
    title: "Dapat bayaran",
    description: "Pembayaran dicairkan berdasarkan views yang valid.",
  },
];

const items = [
  { tag: "Langkah 1", title: "Pilih campaign", description: "Temukan brief yang cocok dengan niche kamu." },
  { tag: "Langkah 2", title: "Buat klip", description: "Edit sesuai brief, lalu posting.", image: "/clip.jpg" },
  { tag: "Langkah 3", title: "Pantau views", description: "Tayangan dihitung otomatis." },
  { tag: "Langkah 4", title: "Dapat bayaran", description: "Cair berdasarkan views valid." },
];

const Headline = ({ className = "" }: { className?: string }) => (
  <h2 className={`text-6xl font-black leading-[1.05] md:text-8xl ${className}`}>
    Konten kamu
    <br />
    layak dibayar.
  </h2>
);

export default function MotionHome() {
  return (
    <div>
      <SparklesBackground className="min-h-[600px] bg-black">
        <h2 className="py-40 text-center text-6xl font-bold text-white">Judul kamu</h2>
      </SparklesBackground>
      <FirefliesBackground className="min-h-[600px] bg-black">
        <h2 className="py-40 text-center text-6xl font-bold text-white">Judul kamu</h2>
      </FirefliesBackground>
      <GlowGridBackground className="min-h-[600px] bg-black">
        <h2 className="py-40 text-center text-6xl font-bold text-white">Judul kamu</h2>
      </GlowGridBackground>
      <AuroraBackground className="min-h-[600px] bg-black">
        <h2 className="py-40 text-center text-6xl font-bold text-white">Judul kamu</h2>
      </AuroraBackground>
      <SpotlightReveal
        className="bg-neutral-950"
        contentClassName="px-8 py-32 md:px-20"
        revealClassName="bg-orange-500"
        base={<Headline className="text-neutral-800" />}
        reveal={<Headline className="text-neutral-950" />}
      />
      <HorizontalScrollGallery heading="Cara kerjanya" items={items} className="bg-neutral-950 text-white" />
      <div className="grid gap-6 bg-black p-10 md:grid-cols-3">
        <GlowTiltCard>
          <h3 className="text-2xl font-bold">Upload klip</h3>
          <p className="mt-2 opacity-70">Posting di akun kamu, views langsung dihitung.</p>
        </GlowTiltCard>

        <GlowTiltCard glowColor="59, 130, 246" maxTilt={8}>
          <h3 className="text-2xl font-bold">Bayaran otomatis</h3>
          <p className="mt-2 opacity-70">Cair berdasarkan views yang valid.</p>
        </GlowTiltCard>
      </div>
      <VelocityMarquee rows={["Go viral", "Get paid", "Clip. Post. Earn."]} className="bg-neutral-950 text-white" />
      <ScrollStory steps={steps} className="bg-neutral-950 text-white" />
      <ScrollWaveReveal
        text="Konten kamu layak dibayar. Mulai dari sini, setiap tayangan punya nilai."
        scrollHeight="300vh"
        className="bg-neutral-950 text-white"
      />{" "}
      <CountUp to={800} suffix="K+" className="text-5xl font-bold" />
      <CountUp to={1250000} prefix="Rp " duration={2} />
      <CountUp to={4.8} decimals={1} />
      <SmokeSection className="min-h-[640px] bg-neutral-950">
        <div className="mx-auto max-w-3xl px-6 py-40 text-center text-white">
          <h2 className="text-5xl font-bold">Judul section kamu</h2>
        </div>
      </SmokeSection>
      <DotImageRepel />
      {/* <Motion1 />
      <First />
      <ScrollAnimation /> */}
      <CursorFollowSection>
        <h1>halo</h1>
        <h1>halo</h1>
        <h1>halo</h1>
        <h1>halo</h1>
        <h1>halo</h1>
        <h1>halo</h1>
        <h1>halo</h1>
      </CursorFollowSection>
    </div>
  );
}
