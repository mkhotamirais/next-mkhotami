import { cn } from "@/lib/utils";
import type { Menu } from "@/lib/types/main";

export const itemKey = (item: Menu) => `${item.label}-${item.url}`;

// Gaya link navigasi: hanya class Tailwind + token tema.
export const navLinkClass = (extra?: string) =>
  cn(
    "inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium transition-colors",
    "hover:bg-accent hover:text-accent-foreground",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "data-[active=true]:bg-accent",
    extra,
  );

// Halaman aktif: cocok persis, atau pathname berada di bawah url tersebut.
export function matchesPath(url: string, pathname: string) {
  if (!url.startsWith("/")) return false; // url kosong, "#", atau eksternal
  if (url === "/") return pathname === "/";
  return pathname === url || pathname.startsWith(`${url}/`);
}

// Panjang url terpanjang yang cocok pada item ini atau turunannya. -1 = tidak aktif.
function matchScore(item: Menu, pathname: string): number {
  const own = matchesPath(item.url, pathname) ? item.url.length : -1;
  const child = Math.max(-1, ...(item.sub_menu?.map((c) => matchScore(c, pathname)) ?? []));
  return Math.max(own, child);
}

// Hanya satu item aktif per daftar: yang paling spesifik.
export function pickActive(items: Menu[] | undefined, pathname: string): Menu | undefined {
  let best: Menu | undefined;
  let bestScore = -1;
  for (const it of items ?? []) {
    const score = matchScore(it, pathname);
    if (score > bestScore) {
      best = it;
      bestScore = score;
    }
  }
  return best;
}
