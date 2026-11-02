import { useCallback, useRef, useState } from "react";

const EDGE_GAP = 8; // jarak minimum dari tepi layar (px)
const PANEL_GAP = 4; // jarak panel dari item (px)

export type Placement = "below" | "side";
export type Flipped = { x: boolean; y: boolean };

export function useEdgeFlip(placement: Placement) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState<Flipped>({ x: false, y: false });

  const measure = useCallback(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;

    const rect = root.getBoundingClientRect();
    const width = panel.offsetWidth; // offsetWidth/Height mengabaikan scale
    const height = panel.offsetHeight;
    const maxX = document.documentElement.clientWidth - EDGE_GAP;
    const maxY = document.documentElement.clientHeight - EDGE_GAP;

    const x = placement === "below" ? rect.left + width > maxX : rect.right + PANEL_GAP + width > maxX;

    const y =
      placement === "below"
        ? // tidak muat di bawah DAN ruang di atas lebih lega
          rect.bottom + PANEL_GAP + height > maxY && rect.top > maxY - rect.bottom
        : // panel sejajar atas item: kalau bagian bawahnya keluar layar, rapatkan ke bawah
          rect.top + height > maxY;

    setFlipped({ x, y });
  }, [placement]);

  return { rootRef, panelRef, flipped, measure };
}

// Class ditulis utuh di setiap cabang supaya terdeteksi Tailwind.
export function edgeFlipClass(placement: Placement, f: Flipped) {
  const side = placement === "side";

  const vertical = side ? (f.y ? "bottom-0" : "top-0") : f.y ? "bottom-full mb-1" : "top-full mt-1";
  const horizontal = side ? (f.x ? "right-full mr-1" : "left-full ml-1") : f.x ? "right-0" : "left-0";
  const origin = f.y
    ? f.x
      ? "origin-bottom-right"
      : "origin-bottom-left"
    : f.x
      ? "origin-top-right"
      : "origin-top-left";

  return `${vertical} ${horizontal} ${origin}`;
}
