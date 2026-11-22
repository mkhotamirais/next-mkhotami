"use client";
import { motion } from "motion/react";

export default function Motion1() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight"
        >
          Bikin Viral, <span className="text-blue-500">Dapet Cuan!</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto"
        >
          Digaji bikin konten dari manapun. 100% gratis, platform kreator paling gampang.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex justify-center gap-4"
        >
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all">
            Mulai Sekarang
          </button>
          <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold transition-all">
            Gabung Discord
          </button>
        </motion.div>
      </div>
    </section>
  );
}
