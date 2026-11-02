"use client";

import { useRef, useState, type MouseEvent, type SyntheticEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { isActive } from "@/lib/utils_nav";
import type { Menu } from "@/lib/types/main";
import { linkClasses } from "../linkClasses";

const EDGE_GAP = 8; // jarak minimum dari tepi layar (px)
const { linkClass, panelBase, panelHidden, panelShown } = linkClasses;

// Setelah klik dengan mouse, link tetap fokus dan menahan dropdown terbuka
// (group-focus-within). Lepas fokusnya, kecuali fokus datang dari keyboard.
function blurIfMouse(e: MouseEvent<HTMLElement>) {
  if (!e.currentTarget.matches(":focus-visible")) e.currentTarget.blur();
}

/* ---------- satu item yang punya dropdown ---------- */

function DropdownItem({ item, pathname, rootPath }: { item: Menu; pathname: string; rootPath: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [alignRight, setAlignRight] = useState(false);

  const subs = item.sub_menu ?? [];
  const own = isActive(item.url, pathname, rootPath);
  // Induk menyala kalau dirinya atau salah satu anaknya aktif.
  const childActive = subs.some((sub) => isActive(sub.url, pathname, rootPath));

  // Dipanggil saat item di-hover atau difokus: muatkah panel kalau rata kiri?
  // Panel memakai `invisible` (bukan display:none), jadi lebarnya tetap bisa diukur.
  const measure = (e: SyntheticEvent<HTMLElement>) => {
    const panel = panelRef.current;
    if (!panel) return;

    const left = e.currentTarget.getBoundingClientRect().left;
    const limit = document.documentElement.clientWidth - EDGE_GAP;

    setAlignRight(left + panel.offsetWidth > limit);
  };

  return (
    <li className="group relative" onMouseEnter={measure} onFocus={measure}>
      <Link
        href={item.url}
        onClick={blurIfMouse}
        aria-current={own ? "page" : undefined}
        data-active={own || childActive}
        className={cn(linkClass, "group-hover:bg-accent group-focus-within:bg-accent")}
      >
        {item.label}
        <ChevronDown
          size={16}
          aria-hidden
          className="transition-transform motion-reduce:transition-none group-hover:rotate-180 group-focus-within:rotate-180"
        />
      </Link>

      {/* pt-1 pada pembungkus menjembatani celah dengan link, jadi hover tidak putus di tengah jalan */}
      <div ref={panelRef} className={cn(panelBase, panelHidden, panelShown, alignRight ? "right-0" : "left-0")}>
        <ul className="flex min-w-40 flex-col whitespace-nowrap rounded-lg border bg-popover p-1 text-popover-foreground">
          {subs.map((sub) => {
            const subActive = isActive(sub.url, pathname, rootPath);

            return (
              <li key={sub.url}>
                <Link
                  href={sub.url}
                  onClick={blurIfMouse}
                  aria-current={subActive ? "page" : undefined}
                  data-active={subActive}
                  className={cn(linkClass, "flex w-full")}
                >
                  {sub.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

/* ---------- component ---------- */

type Props = {
  menu: Menu[];
  rootPath: string;
  className?: string;
};

export default function NavDesktopTwoLevel({ menu, rootPath, className = "hidden md:block" }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu utama" className={className}>
      <ul className="flex gap-1">
        {menu.map((item) => {
          // Dengan sub_menu: dropdown.
          if (item.sub_menu?.length) {
            return <DropdownItem key={item.url} item={item} pathname={pathname} rootPath={rootPath} />;
          }

          // Tanpa sub_menu: link biasa.
          const active = isActive(item.url, pathname, rootPath);

          return (
            <li key={item.url}>
              <Link
                href={item.url}
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
  );
}
