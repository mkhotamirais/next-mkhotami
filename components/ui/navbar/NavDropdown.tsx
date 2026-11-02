"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinkClass } from "@/lib/utils_nav";
import { edgeFlipClass, useEdgeFlip, type Placement } from "@/hooks/useEdgeFlip";
import { useDropdown } from "@/hooks/useDropdown";

type Props = {
  /** Isi tombol pemicu. */
  label: ReactNode;
  /** "below": di bawah item (level 1). "side": di samping item (level bersarang). */
  placement?: Placement;
  /** Tandai tombol sebagai halaman aktif. */
  active?: boolean;
  /** Buka dengan hover untuk mouse. */
  hover?: boolean;
  /** Isi panel. `close` menutup dropdown ini. */
  children: (api: { close: () => void }) => ReactNode;
};

export default function NavDropdown({ label, placement = "below", active = false, hover = true, children }: Props) {
  const { rootRef, panelRef, flipped, measure } = useEdgeFlip(placement);
  const { open, close, rootProps, triggerProps, panelProps } = useDropdown(rootRef, {
    hover,
    onOpen: measure,
  });
  const side = placement === "side";

  return (
    <div ref={rootRef} className="relative" {...rootProps}>
      <button
        type="button"
        data-active={active}
        {...triggerProps}
        className={navLinkClass(cn("aria-expanded:bg-accent", side && "w-full justify-between"))}
      >
        {label}
        {side ? (
          <ChevronRight size={16} aria-hidden />
        ) : (
          <ChevronDown
            size={16}
            aria-hidden
            className={cn("transition-transform motion-reduce:transition-none", open && "rotate-180")}
          />
        )}
      </button>

      <div
        ref={panelRef}
        {...panelProps}
        className={cn(
          "absolute z-50 flex flex-col whitespace-nowrap rounded-lg border bg-popover p-1 text-popover-foreground",
          edgeFlipClass(placement, flipped),
          "transition-[opacity,translate,scale,visibility] motion-reduce:transition-none",
          open
            ? "visible translate-y-0 scale-100 opacity-100 duration-200 ease-out"
            : "invisible -translate-y-1 scale-95 opacity-0 duration-150 ease-in",
        )}
      >
        {children({ close })}
      </div>
    </div>
  );
}
