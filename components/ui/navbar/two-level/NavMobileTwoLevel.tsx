"use client";

import { useEffect, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu as MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isActive } from "@/lib/utils_nav";
import type { Menu } from "@/lib/types/main";
import { useNavMobileTwoLevel } from "./useNavMobileTwoLevel";

const PANEL_ID = "nav-mobile-two-level";
// Penanda area "di dalam" nav mobile (tombol + panel). Klik di area ini bukan klik di luar.
const SCOPE_ATTR = "data-nav-mobile-two-level";

const linkClass =
  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent data-[active=true]:bg-accent";

/* ---------------------------------- Button --------------------------------- */

export function NavMobileTwoLevelBtn({ className }: { className?: string }) {
  const open = useNavMobileTwoLevel((s) => s.open);
  const toggle = useNavMobileTwoLevel((s) => s.toggle);

  return (
    <Button
      {...{ [SCOPE_ATTR]: "" }}
      type="button"
      size="icon"
      variant="outline"
      aria-label={open ? "Tutup menu" : "Buka menu"}
      aria-expanded={open}
      aria-controls={PANEL_ID}
      onClick={toggle}
      className={cn("md:hidden", className)}
    >
      {open ? <X /> : <MenuIcon />}
    </Button>
  );
}

/* ------------------------- Item yang punya sub-menu ------------------------ */

function SubMenuItem({ item, pathname, rootPath }: { item: Menu; pathname: string; rootPath: string }) {
  // Selector mengembalikan boolean, jadi item ini hanya render ulang saat statusnya sendiri berubah.
  const expanded = useNavMobileTwoLevel((s) => s.openSub === item.url);
  const toggleSub = useNavMobileTwoLevel((s) => s.toggleSub);
  const close = useNavMobileTwoLevel((s) => s.close);
  const subId = useId();

  const subs = item.sub_menu ?? [];
  const own = isActive(item.url, pathname, rootPath);
  // Induk menyala kalau dirinya atau salah satu anaknya aktif.
  const childActive = subs.some((sub) => isActive(sub.url, pathname, rootPath));

  return (
    <li>
      <div className="flex items-center gap-1">
        <Link
          href={item.url}
          onClick={close}
          aria-current={own ? "page" : undefined}
          data-active={own || childActive}
          className={cn(linkClass, "flex-1")}
        >
          {item.label}
        </Link>

        <button
          type="button"
          aria-label={`Sub-menu ${item.label}`}
          aria-expanded={expanded}
          aria-controls={subId}
          onClick={() => toggleSub(item.url)}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronDown
            size={16}
            aria-hidden
            className={cn("transition-transform motion-reduce:transition-none", expanded && "rotate-180")}
          />
        </button>
      </div>

      {/* Trik yang sama dengan panel utama: tinggi beranimasi dari 0fr ke 1fr */}
      <div
        id={subId}
        inert={!expanded}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <ul className="ml-3 mt-1 flex flex-col gap-1 border-l pl-2">
            {subs.map((sub) => {
              const subActive = isActive(sub.url, pathname, rootPath);

              return (
                <li key={sub.url}>
                  <Link
                    href={sub.url}
                    onClick={close}
                    aria-current={subActive ? "page" : undefined}
                    data-active={subActive}
                    className={linkClass}
                  >
                    {sub.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}

/* --------------------------------- Content --------------------------------- */

type ContentProps = {
  menu: Menu[];
  rootPath: string;
  className?: string;
};

export function NavMobileTwoLevelContent({ menu, rootPath, className }: ContentProps) {
  const open = useNavMobileTwoLevel((s) => s.open);
  const close = useNavMobileTwoLevel((s) => s.close);
  const pathname = usePathname();

  // Tutup saat halaman berpindah, termasuk lewat tombol back browser.
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Tutup dengan Escape atau klik di luar nav mobile.
  // Pendengar hanya terpasang selama menu terbuka, lalu dilepas lagi.
  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(`[${SCOPE_ATTR}]`)) return; // di dalam: abaikan
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <div
      {...{ [SCOPE_ATTR]: "" }}
      id={PANEL_ID}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className,
      )}
    >
      <div className="overflow-hidden">
        <nav aria-label="Menu utama" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t p-2">
          <ul className="flex flex-col gap-1">
            {menu.map((item) => {
              // Dengan sub_menu: item accordion.
              if (item.sub_menu?.length) {
                return <SubMenuItem key={item.url} item={item} pathname={pathname} rootPath={rootPath} />;
              }

              // Tanpa sub_menu: link biasa.
              const active = isActive(item.url, pathname, rootPath);

              return (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    data-active={active}
                    className={linkClass}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
