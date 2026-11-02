"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isActive } from "@/lib/utils_nav";
import type { Menu } from "@/lib/types/main";
import { useNavMobileSingleLevel } from "./useNavMobileSingleLevel";

const PANEL_ID = "nav-mobile-single-level";
// Penanda area "di dalam" nav mobile (tombol + panel). Klik di area ini bukan klik di luar.
const SCOPE_ATTR = "data-nav-mobile-single-level";

export function NavMobileSingleLevelBtn({ className }: { className?: string }) {
  const open = useNavMobileSingleLevel((s) => s.open);
  const toggle = useNavMobileSingleLevel((s) => s.toggle);

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

type ContentProps = {
  menu: Menu[];
  rootPath: string;
  className?: string;
};

export function NavMobileSingleLevelContent({ menu, rootPath, className }: ContentProps) {
  const open = useNavMobileSingleLevel((s) => s.open);
  const close = useNavMobileSingleLevel((s) => s.close);
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
              const active = isActive(item.url, pathname, rootPath);

              return (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    data-active={active}
                    className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent data-[active=true]:bg-accent"
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
