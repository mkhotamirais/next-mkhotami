"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Menu } from "@/lib/types/main";
import { itemKey, isActive, navLinkClass, pickActive } from "@/lib/utils_nav";
import NavDropdown from "./NavDropdown";

// Tombol auth: item terakhir jadi tombol utama (terisi), sisanya outline.
const authClass = (primary: boolean) =>
  cn(
    "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
    primary
      ? "bg-primary text-primary-foreground hover:bg-primary/90 data-[active=true]:bg-primary/90"
      : "border hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent",
  );

/* ---------- satu item menu (rekursif) ---------- */

function MenuNode({
  item,
  level,
  active,
  onNavigate,
}: {
  item: Menu;
  level: number; // 0 = menu utama, 1+ = di dalam panel
  active: boolean;
  onNavigate?: () => void; // dipanggil saat link diklik, untuk menutup dropdown induk
}) {
  const pathname = usePathname();
  const top = level === 0;

  // Tanpa sub_menu: link biasa.
  if (!item.sub_menu?.length) {
    return (
      <Link
        href={item.url}
        onClick={onNavigate}
        aria-current={active && isActive(item.url, pathname) ? "page" : undefined}
        data-active={active}
        className={navLinkClass(top ? undefined : "w-full justify-start")}
      >
        {item.label}
      </Link>
    );
  }

  // Dengan sub_menu: dropdown. Anak-anaknya dirender dengan MenuNode yang sama.
  const subs = item.sub_menu;
  const activeChild = pickActive(subs, pathname);

  return (
    <NavDropdown label={item.label} placement={top ? "below" : "side"} active={active}>
      {({ close }) =>
        subs.map((child) => (
          <MenuNode
            key={itemKey(child)}
            item={child}
            level={level + 1}
            active={child === activeChild}
            onNavigate={() => {
              close();
              onNavigate?.();
            }}
          />
        ))
      }
    </NavDropdown>
  );
}

/* ---------- component ---------- */

type Props = {
  menu?: Menu[];
  /** Tombol untuk tamu (Login, Daftar). */
  authMenu?: Menu[];
  /** Slot di sisi kanan, mis. menu profil. Opsional. */
  children?: ReactNode;
  className?: string;
};

export default function NavDesktopStandard({ menu, authMenu, children, className = "hidden md:flex" }: Props) {
  const pathname = usePathname();

  // Satu item aktif di SELURUH navigasi (menu utama + auth), bukan per grup.
  const activeTop = pickActive([...(menu ?? []), ...(authMenu ?? [])], pathname);

  return (
    <div className={cn("h-16 items-center justify-between", className)}>
      <div className="flex items-center gap-4">
        <nav aria-label="Menu utama" className="flex gap-1">
          {menu?.map((item) => (
            <MenuNode key={itemKey(item)} item={item} level={0} active={item === activeTop} />
          ))}
        </nav>

        {authMenu && authMenu.length > 0 && (
          <nav aria-label="Akun" className="guest-only flex items-center gap-2">
            {authMenu.map((item, i) => (
              <Link
                key={itemKey(item)}
                href={item.url}
                aria-current={item === activeTop && isActive(item.url, pathname) ? "page" : undefined}
                data-active={item === activeTop}
                className={authClass(i === authMenu.length - 1)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {children}
      </div>
    </div>
  );
}
