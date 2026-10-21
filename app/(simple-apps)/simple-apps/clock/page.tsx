"use client";

import { useSyncExternalStore } from "react";

const CENTER = 100;

// Berlangganan "tick" waktu. Dicek tiap 250ms supaya detik tidak terlewat
// akibat drift setInterval; React tidak render ulang kalau nilainya sama.
const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 250);
  return () => clearInterval(id);
};
const getSnapshot = () => Math.floor(Date.now() / 1000); // detik (primitif, stabil)
const getServerSnapshot = () => null; // di server belum ada waktu

// Konversi sudut (derajat, 0 = jam 12) + jari-jari menjadi koordinat SVG
const round = (n: number) => Math.round(n * 1000) / 1000;

const polar = (angle: number, radius: number) => {
  const rad = (Math.PI / 180) * angle;
  return {
    x: round(CENTER + radius * Math.sin(rad)),
    y: round(CENTER - radius * Math.cos(rad)),
  };
};

const pad = (n: number) => String(n).padStart(2, "0");

type HandProps = { angle: number; length: number; width: number; color?: string };

function Hand({ angle, length, width, color = "black" }: HandProps) {
  const { x, y } = polar(angle, length);
  return <line x1={CENTER} y1={CENTER} x2={x} y2={y} stroke={color} strokeWidth={width} strokeLinecap="round" />;
}

export default function Clock() {
  // null di server & saat hidrasi, lalu otomatis berisi waktu client
  const tick = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const time = tick === null ? null : new Date(tick * 1000);

  const hours = time?.getHours() ?? 0;
  const minutes = time?.getMinutes() ?? 0;
  const seconds = time?.getSeconds() ?? 0;

  const digital = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return (
    <div className="container">
      <h1 className="h1">Clock</h1>
      <svg
        width={300}
        height={300}
        viewBox="0 0 200 200"
        role="img"
        aria-label={time ? `Jam ${digital}` : "Jam"}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-500 bg-white shadow-lg"
      >
        <circle cx={CENTER} cy={CENTER} r={95} stroke="black" strokeWidth={2} fill="none" />

        {/* Gerigi menit */}
        {Array.from({ length: 60 }, (_, i) => {
          const p1 = polar(i * 6, 85);
          const p2 = polar(i * 6, 90);
          return (
            <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="black" strokeWidth={i % 5 === 0 ? 2 : 1} />
          );
        })}

        {/* Angka jam */}
        {Array.from({ length: 12 }, (_, i) => {
          const { x, y } = polar((i + 1) * 30, 72);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={12}>
              {i + 1}
            </text>
          );
        })}

        {/* Jam digital & jarum hanya dirender setelah waktu client tersedia */}
        {time && (
          <>
            <text x={CENTER} y={140} textAnchor="middle" fontSize={14} fontWeight="bold" fill="black">
              {digital}
            </text>
            <Hand angle={(hours % 12) * 30 + minutes * 0.5} length={50} width={4} />
            <Hand angle={minutes * 6} length={70} width={3} />
            <Hand angle={seconds * 6} length={80} width={2} color="red" />
          </>
        )}

        <circle cx={CENTER} cy={CENTER} r={4} fill="black" />
      </svg>
    </div>
  );
}
