"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function DropdownWithState() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const panelId = useId();

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const openNow = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    timer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    console.log("pasang pendengar");

    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
      console.log(e.target);
      //   console.log(ref.current);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      console.log("lepas pendengar");
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="p-10">
      <div
        ref={ref}
        className="relative inline-block"
        onPointerEnter={(e) => e.pointerType === "mouse" && openNow()}
        onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
        }}
      >
        <button onClick={() => setOpen((o) => !o)} className="rounded border px-3 py-1">
          Produk
        </button>

        {/* {open && (
          <div className="absolute left-0 top-full mt-1 w-48 rounded-lg border bg-popover p-1">
            <a href="#a" className="block px-2 py-1">
              Item A
            </a>
            <a href="#b" className="block px-2 py-1">
              Item B
            </a>
          </div>
        )} */}
        <div
          id={panelId}
          inert={!open}
          className={
            "absolute left-0 top-full mt-1 w-48 origin-top-left rounded-lg border bg-popover p-1 " +
            "transition-[opacity,translate,scale,visibility] " +
            (open
              ? "visible translate-y-0 scale-100 opacity-100 duration-200 ease-out"
              : "invisible -translate-y-1 scale-95 opacity-0 duration-150 ease-in")
          }
        >
          <a href="#a" className="block px-2 py-1">
            Item A
          </a>
          <a href="#b" className="block px-2 py-1">
            Item B
          </a>
        </div>
      </div>
    </div>
  );
}
