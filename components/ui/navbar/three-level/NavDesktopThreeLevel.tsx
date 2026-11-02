"use client";

import { useRef, useState, type MouseEvent, type SyntheticEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasActiveChild, isActive } from "@/lib/utils_nav";
import type { Menu } from "@/lib/types/main";

const EDGE_GAP = 8; // jarak minimum dari tepi layar (px)

const linkClass =
  "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent data-[active=true]:bg-accent";

type Placement = "below" | "side";

// Class ditulis utuh agar terdeteksi Tailwind. Hanya dua nama group (below dan side),
// jadi menu ini mendukung maksimal TIGA tingkat: item tingkat 1 memakai `below`,
// item di dalam panel memakai `side`. Tingkat keempat akan ikut terbuka bersama induknya.
const PLACEMENT = {
  below: {
    host: "group/below relative",
    trigger: "group-hover/below:bg-accent group-focus-within/below:bg-accent",
    chevron: "group-hover/below:rotate-180 group-focus-within/below:rotate-180",
    panel:
      "top-full pt-1 invisible -translate-y-1 opacity-0 group-hover/below:visible group-hover/below:translate-y-0 group-hover/below:opacity-100 group-focus-within/below:visible group-focus-within/below:translate-y-0 group-focus-within/below:opacity-100",
    start: "left-0",
    end: "right-0",
  },
  side: {
    host: "group/side relative",
    trigger: "group-hover/side:bg-accent group-focus-within/side:bg-accent",
    chevron: "",
    panel:
      "top-0 invisible opacity-0 group-hover/side:visible group-hover/side:translate-x-0 group-hover/side:opacity-100 group-focus-within/side:visible group-focus-within/side:translate-x-0 group-focus-within/side:opacity-100",
    start: "left-full pl-2 -translate-x-1",
    end: "right-full pr-2 translate-x-1",
  },
} as const;

const panelBase =
  "absolute z-50 transition-[opacity,translate,visibility] duration-200 ease-out motion-reduce:transition-none";

// Setelah klik dengan mouse, link tetap fokus dan menahan dropdown terbuka
// (group-focus-within). Lepas fokusnya, kecuali fokus datang dari keyboard.
function blurIfMouse(e: MouseEvent<HTMLElement>) {
  if (!e.currentTarget.matches(":focus-visible")) e.currentTarget.blur();
}

type NodeProps = {
  item: Menu;
  pathname: string;
  rootPath: string;
};

/* ---------- item yang punya sub-menu ---------- */

function DropdownNode({ item, placement, pathname, rootPath }: NodeProps & { placement: Placement }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [alignEnd, setAlignEnd] = useState(false);

  const p = PLACEMENT[placement];
  const side = placement === "side";
  const own = isActive(item.url, pathname, rootPath);
  // Menyala kalau halamannya sendiri, atau salah satu turunan (di tingkat mana pun) aktif.
  const branchActive = own || hasActiveChild(item, pathname, rootPath);

  // Dipanggil saat item di-hover atau difokus: muatkah panel di arah bawaannya?
  // Panel memakai `invisible` (bukan display:none), jadi lebarnya tetap bisa diukur.
  const measure = (e: SyntheticEvent<HTMLElement>) => {
    const panel = panelRef.current;
    if (!panel) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const limit = document.documentElement.clientWidth - EDGE_GAP;
    const edge = side ? rect.right : rect.left; // below: panel mulai dari kiri item, side: dari kanan item

    setAlignEnd(edge + panel.offsetWidth > limit);
  };

  return (
    <li className={cn(p.host, side && "w-full")} onMouseEnter={measure} onFocus={measure}>
      <Link
        href={item.url}
        onClick={blurIfMouse}
        aria-current={own ? "page" : undefined}
        data-active={branchActive}
        className={cn(linkClass, p.trigger, side && "flex w-full justify-between")}
      >
        {item.label}
        {side ? (
          <ChevronRight size={16} aria-hidden />
        ) : (
          <ChevronDown
            size={16}
            aria-hidden
            className={cn("transition-transform motion-reduce:transition-none", p.chevron)}
          />
        )}
      </Link>

      {/* Pembungkus panel memakai padding (bukan margin) untuk menjembatani celah, jadi hover tidak putus */}
      <div ref={panelRef} className={cn(panelBase, p.panel, alignEnd ? p.end : p.start)}>
        <ul className="flex min-w-40 flex-col whitespace-nowrap rounded-lg border bg-popover p-1 text-popover-foreground">
          {item.sub_menu?.map((sub) => (
            // Anak-anaknya dirender dengan komponen yang sama (rekursi).
            <MenuNode key={sub.url} item={sub} top={false} pathname={pathname} rootPath={rootPath} />
          ))}
        </ul>
      </div>
    </li>
  );
}

/* ---------- satu item: link biasa atau dropdown ---------- */

function MenuNode({ item, top, pathname, rootPath }: NodeProps & { top: boolean }) {
  if (item.sub_menu?.length) {
    return <DropdownNode item={item} placement={top ? "below" : "side"} pathname={pathname} rootPath={rootPath} />;
  }

  const active = isActive(item.url, pathname, rootPath);

  return (
    <li>
      <Link
        href={item.url}
        onClick={blurIfMouse}
        aria-current={active ? "page" : undefined}
        data-active={active}
        className={cn(linkClass, !top && "flex w-full")}
      >
        {item.label}
      </Link>
    </li>
  );
}

/* ---------- component ---------- */

type Props = {
  menu: Menu[];
  rootPath: string;
  className?: string;
};

export default function NavDesktopThreeLevel({ menu, rootPath, className = "hidden md:block" }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu utama" className={className}>
      <ul className="flex gap-1">
        {menu.map((item) => (
          <MenuNode key={item.url} item={item} top pathname={pathname} rootPath={rootPath} />
        ))}
      </ul>
    </nav>
  );
}
