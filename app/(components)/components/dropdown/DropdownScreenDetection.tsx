"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { edgeFlipClass, useEdgeFlip } from "@/hooks/useEdgeFlip";

export function FlipDropdown({ label, items = 4 }: { label: string; items?: number }) {
  const [open, setOpen] = useState(false);
  const { rootRef, panelRef, flipped, measure } = useEdgeFlip("below");

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          if (!open) measure(); // ukur hanya saat akan dibuka
          setOpen((o) => !o);
        }}
        className="rounded border px-3 py-1 text-sm"
      >
        {label}
      </button>

      <div
        ref={panelRef}
        inert={!open}
        className={cn(
          "absolute z-50 w-56 rounded-lg border bg-popover p-1",
          "transition-[opacity,translate,scale,visibility] duration-150",
          edgeFlipClass("below", flipped),
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
        )}
      >
        <p className="px-2 py-1 text-xs text-muted-foreground">
          x: {String(flipped.x)} · y: {String(flipped.y)}
        </p>
        {Array.from({ length: items }, (_, i) => (
          <a key={i} href="#" className="block px-2 py-1 text-sm">
            Item {i + 1}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function DropdownScreenDetection() {
  return (
    <div className="min-h-screen">
      <div className="fixed left-4 top-4">
        <FlipDropdown label="Kiri atas" />
      </div>
      <div className="fixed right-4 top-4">
        <FlipDropdown label="Kanan atas" />
      </div>
      <div className="fixed bottom-4 left-4">
        <FlipDropdown label="Kiri bawah" />
      </div>
      <div className="fixed bottom-4 right-4">
        <FlipDropdown label="Kanan bawah" />
      </div>
    </div>
  );
}
