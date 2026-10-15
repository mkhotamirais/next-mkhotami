"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Menu } from "@/lib/types/main";

/* ---------- helpers ---------- */

const itemKey = (item: Menu) => `${item.label}-${item.url}`;

// Pengganti buttonVariants: hanya class Tailwind + token tema.
const linkClass = (extra?: string) =>
  cn(
    "inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium transition-colors",
    "hover:bg-accent hover:text-accent-foreground",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "data-[active=true]:bg-accent",
    extra,
  );

// Tombol auth: item terakhir jadi tombol utama (terisi), sisanya outline.
const authClass = (primary: boolean) =>
  cn(
    "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
    primary
      ? "bg-primary text-primary-foreground hover:bg-primary/90 data-[active=true]:bg-primary/90"
      : "border hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent",
  );

// Halaman aktif: cocok persis, atau pathname berada di bawah url tersebut.
function matchesPath(url: string, pathname: string) {
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
function pickActive(items: Menu[] | undefined, pathname: string): Menu | undefined {
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

/* ---------- panel dropdown yang sadar tepi layar ---------- */

const EDGE_GAP = 8; // jarak minimum dari tepi layar (px)
const PANEL_GAP = 4; // jarak panel samping dari induknya (px)

// Class harus ditulis utuh agar terdeteksi Tailwind.
const PANEL_STYLES = {
  // Level 2: muncul di bawah item. Default rata kiri, dibalik jadi rata kanan.
  below: {
    base: "top-full invisible scale-95 translate-y-2 opacity-0 delay-150 group-hover/main:visible group-hover/main:scale-100 group-hover/main:translate-y-0 group-hover/main:opacity-100 group-hover/main:delay-0 group-focus-within/main:visible group-focus-within/main:scale-100 group-focus-within/main:translate-y-0 group-focus-within/main:opacity-100 group-focus-within/main:delay-0",
    normal: "left-0 origin-top-left",
    flipped: "right-0 origin-top-right",
  },
  // Level 3: muncul di samping item. Default ke kanan, dibalik ke kiri.
  side: {
    base: "top-0 invisible scale-95 opacity-0 delay-150 group-hover/sub:visible group-hover/sub:scale-100 group-hover/sub:translate-x-0 group-hover/sub:opacity-100 group-hover/sub:delay-0 group-focus-within/sub:visible group-focus-within/sub:scale-100 group-focus-within/sub:translate-x-0 group-focus-within/sub:opacity-100 group-focus-within/sub:delay-0 before:absolute before:inset-y-0 before:w-2 before:content-['']",
    normal: "left-full ml-1 translate-x-2 origin-top-left before:-left-2",
    flipped: "right-full mr-1 -translate-x-2 origin-top-right before:-right-2",
  },
} as const;

// Kontrak: placement="below" → induk langsung wajib `group/main relative`,
//          placement="side"  → induk langsung wajib `group/sub relative`.
function Panel({ placement, children }: { placement: keyof typeof PANEL_STYLES; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  // Setiap kali induk di-hover / difokus, cek apakah panel muat di layar.
  // Panel memakai `invisible` (bukan display:none), jadi lebarnya tetap bisa diukur.
  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const check = () => {
      const rect = parent.getBoundingClientRect();
      const width = el.offsetWidth;
      const limit = document.documentElement.clientWidth - EDGE_GAP;

      setFlipped(placement === "below" ? rect.left + width > limit : rect.right + PANEL_GAP + width > limit);
    };

    parent.addEventListener("mouseenter", check);
    parent.addEventListener("focusin", check);
    return () => {
      parent.removeEventListener("mouseenter", check);
      parent.removeEventListener("focusin", check);
    };
  }, [placement]);

  const style = PANEL_STYLES[placement];

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 flex flex-col whitespace-nowrap rounded-lg border bg-popover p-1 text-popover-foreground",
        "transition-[opacity,transform,translate,scale,visibility] duration-200 ease-out motion-reduce:transition-none",
        style.base,
        flipped ? style.flipped : style.normal,
      )}
    >
      {children}
    </div>
  );
}

/* ---------- component ---------- */

export default function NavDesktopStandard({ menu, authMenu }: { menu?: Menu[]; authMenu?: Menu[] }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Satu item aktif di SELURUH navigasi (menu utama + auth), bukan per grup.
  const activeTop = pickActive([...(menu ?? []), ...(authMenu ?? [])], pathname);

  // Setelah pindah halaman lewat klik mouse, link masih fokus sehingga
  // `group-focus-within` menjaga dropdown tetap terbuka. Lepas fokus itu,
  // tapi biarkan fokus keyboard (:focus-visible) agar tidak hilang.
  useEffect(() => {
    const el = document.activeElement;
    if (el instanceof HTMLElement && navRef.current?.contains(el) && !el.matches(":focus-visible")) {
      el.blur();
    }
  }, [pathname]);

  return (
    <div className="hidden h-16 items-center justify-between md:flex">
      <div className="flex items-center gap-4">
        <nav ref={navRef} aria-label="Menu utama" className="flex gap-1">
          {menu?.map((item) => {
            const activeSub = pickActive(item.sub_menu, pathname);

            return (
              <div key={itemKey(item)} className="group/main relative">
                <Link
                  href={item.url}
                  aria-current={item === activeTop && matchesPath(item.url, pathname) ? "page" : undefined}
                  data-active={item === activeTop}
                  className={linkClass("group-hover/main:bg-accent group-focus-within/main:bg-accent")}
                >
                  {item.label}
                  {item.sub_menu && (
                    <ChevronDown
                      aria-hidden
                      className="transition-transform motion-reduce:transition-none group-focus-within/main:rotate-180 group-hover/main:rotate-180"
                    />
                  )}
                </Link>

                {item.sub_menu && (
                  <Panel placement="below">
                    {item.sub_menu.map((sub) => {
                      const activeLeaf = pickActive(sub.sub_menu, pathname);

                      return (
                        <div key={itemKey(sub)} className="group/sub relative">
                          <Link
                            href={sub.url}
                            aria-current={sub === activeSub && matchesPath(sub.url, pathname) ? "page" : undefined}
                            data-active={sub === activeSub}
                            className={linkClass(
                              cn(
                                "w-full group-hover/sub:bg-accent group-focus-within/sub:bg-accent",
                                sub.sub_menu ? "justify-between" : "justify-start",
                              ),
                            )}
                          >
                            {sub.label}
                            {sub.sub_menu && <ChevronRight aria-hidden />}
                          </Link>

                          {sub.sub_menu && (
                            <Panel placement="side">
                              {sub.sub_menu.map((leaf) => (
                                <Link
                                  key={itemKey(leaf)}
                                  href={leaf.url}
                                  aria-current={
                                    leaf === activeLeaf && matchesPath(leaf.url, pathname) ? "page" : undefined
                                  }
                                  data-active={leaf === activeLeaf}
                                  className={linkClass("w-full justify-start")}
                                >
                                  {leaf.label}
                                </Link>
                              ))}
                            </Panel>
                          )}
                        </div>
                      );
                    })}
                  </Panel>
                )}
              </div>
            );
          })}
        </nav>

        {authMenu && authMenu.length > 0 && (
          <nav aria-label="Akun" className="flex items-center gap-2">
            {authMenu.map((item, i) => (
              <Link
                key={itemKey(item)}
                href={item.url}
                aria-current={item === activeTop && matchesPath(item.url, pathname) ? "page" : undefined}
                data-active={item === activeTop}
                className={authClass(i === authMenu.length - 1)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
