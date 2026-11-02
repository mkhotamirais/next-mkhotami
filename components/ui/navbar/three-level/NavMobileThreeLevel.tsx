"use client";

import { useEffect, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu as MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hasActiveChild, isActive } from "@/lib/utils_nav";
import type { Menu } from "@/lib/types/main";
import { useNavMobileThreeLevel } from "./useNavMobileThreeLevel";

const PANEL_ID = "nav-mobile-three-level";
// Penanda area "di dalam" nav mobile (tombol + panel). Klik di area ini bukan klik di luar.
const SCOPE_ATTR = "data-nav-mobile-three-level";

const linkClass =
  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent data-[active=true]:bg-accent";

/* ---------------------------------- Button --------------------------------- */

export function NavMobileThreeLevelBtn({ className }: { className?: string }) {
  const open = useNavMobileThreeLevel((s) => s.open);
  const toggle = useNavMobileThreeLevel((s) => s.toggle);

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

/* ------------------------------ Daftar rekursif ---------------------------- */

type ListProps = {
  items: Menu[];
  level: number; // 0 = tingkat 1, 1 = tingkat 2, dst.
  pathname: string;
  rootPath: string;
};

function MobileList({ items, level, pathname, rootPath }: ListProps) {
  return (
    <ul className={cn("flex flex-col gap-1", level > 0 && "ml-3 mt-1 border-l pl-2")}>
      {items.map((item) =>
        item.sub_menu?.length ? (
          <MobileBranch key={item.url} item={item} level={level} pathname={pathname} rootPath={rootPath} />
        ) : (
          <MobileLeaf key={item.url} item={item} pathname={pathname} rootPath={rootPath} />
        ),
      )}
    </ul>
  );
}

// Item tanpa anak: link biasa.
function MobileLeaf({ item, pathname, rootPath }: Omit<ListProps, "items" | "level"> & { item: Menu }) {
  const close = useNavMobileThreeLevel((s) => s.close);
  const active = isActive(item.url, pathname, rootPath);

  return (
    <li>
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
}

// Item dengan anak: link + tombol panah, dan daftar anak yang meluncur terbuka.
function MobileBranch({ item, level, pathname, rootPath }: Omit<ListProps, "items"> & { item: Menu }) {
  // Selector mengembalikan boolean, jadi item ini hanya render ulang saat statusnya sendiri berubah.
  const expanded = useNavMobileThreeLevel((s) => s.openPath[level] === item.url);
  const toggleSub = useNavMobileThreeLevel((s) => s.toggleSub);
  const close = useNavMobileThreeLevel((s) => s.close);
  const subId = useId();

  const own = isActive(item.url, pathname, rootPath);
  const branchActive = own || hasActiveChild(item, pathname, rootPath);

  return (
    <li>
      <div className="flex items-center gap-1">
        <Link
          href={item.url}
          onClick={close}
          aria-current={own ? "page" : undefined}
          data-active={branchActive}
          className={cn(linkClass, "flex-1")}
        >
          {item.label}
        </Link>

        <button
          type="button"
          aria-label={`Sub-menu ${item.label}`}
          aria-expanded={expanded}
          aria-controls={subId}
          onClick={() => toggleSub(level, item.url)}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronDown
            size={16}
            aria-hidden
            className={cn("transition-transform motion-reduce:transition-none", expanded && "rotate-180")}
          />
        </button>
      </div>

      {/* Tinggi beranimasi dari 0fr ke 1fr; `inert` mengunci link saat tertutup */}
      <div
        id={subId}
        inert={!expanded}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          {/* Rekursi: daftar anak memakai komponen yang sama, satu tingkat lebih dalam */}
          <MobileList items={item.sub_menu ?? []} level={level + 1} pathname={pathname} rootPath={rootPath} />
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

export function NavMobileThreeLevelContent({ menu, rootPath, className }: ContentProps) {
  const open = useNavMobileThreeLevel((s) => s.open);
  const close = useNavMobileThreeLevel((s) => s.close);
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
          <MobileList items={menu} level={0} pathname={pathname} rootPath={rootPath} />
        </nav>
      </div>
    </div>
  );
}
