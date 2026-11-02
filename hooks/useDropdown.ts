"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

type Options = {
  /** Buka dengan hover (khusus mouse). Sentuhan dan keyboard tetap lewat klik. */
  hover?: boolean;
  /** Jeda sebelum menutup saat mouse keluar (ms), agar bisa melintasi celah. */
  closeDelay?: number;
  /** Dipanggil tepat sebelum membuka, mis. untuk mengukur tepi layar. */
  onOpen?: () => void;
};

export function useDropdown(
  rootRef: RefObject<HTMLElement | null>,
  { hover = true, closeDelay = 150, onOpen }: Options = {},
) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const panelId = useId();

  const openNow = useCallback(() => {
    clearTimeout(timer.current);
    if (!open) onOpen?.();
    setOpen(true);
  }, [open, onOpen]);

  const close = useCallback(() => {
    clearTimeout(timer.current);
    setOpen(false);
  }, []);

  const closeSoon = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay]);

  const toggle = useCallback(() => {
    clearTimeout(timer.current);
    if (!open) onOpen?.();
    setOpen((o) => !o);
  }, [open, onOpen]);

  // Bersihkan timer saat komponen hilang.
  useEffect(() => () => clearTimeout(timer.current), []);

  // Escape dan klik/sentuh di luar. Pendengar hanya terpasang saat terbuka.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, rootRef]);

  return {
    open,
    close,
    // Sebarkan ke elemen pembungkus (yang juga memegang rootRef).
    rootProps: {
      onPointerEnter: hover
        ? (e: ReactPointerEvent<HTMLElement>) => {
            if (e.pointerType === "mouse") openNow();
          }
        : undefined,
      onPointerLeave: hover
        ? (e: ReactPointerEvent<HTMLElement>) => {
            if (e.pointerType === "mouse") closeSoon();
          }
        : undefined,
      // Fokus keluar dari dropdown (Tab) → tutup.
      onBlur: (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      },
    },
    // Sebarkan ke tombol pemicu.
    triggerProps: {
      ref: triggerRef,
      "aria-expanded": open,
      "aria-controls": panelId,
      onClick: toggle,
    },
    // Sebarkan ke panel.
    panelProps: {
      id: panelId,
      inert: !open,
    },
  };
}
