"use client";

import React from "react";
import { motion, useScroll } from "motion/react";

export default function ScrollAnimation() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="relative max-h-100 border rounded-xl overflow-y-scroll">
      <motion.div
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          originX: 0,
          backgroundColor: "red",
        }}
      />
      <div className="h-1000">halo</div>
    </div>
  );
}
