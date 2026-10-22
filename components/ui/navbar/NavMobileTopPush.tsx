"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Menu as MenuIcon, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Menu } from "@/lib/types/main";
import type { NavUser } from "./NavUserMenu";
import { useNavMobileTopPush } from "./useNavMobileTopPush";

const PANEL_ID = "nav-mobile-top-push";
// penanda area "di dalam" nav mobile (tombol + panel)
const SCOPE_ATTR = "data-nav-mobile-top-push";

/* ---------------------------------- Button --------------------------------- */

export function NavMobileTopPushBtn({ className = "md:hidden" }: { className?: string }) {
  const open = useNavMobileTopPush((s) => s.open);
  const toggle = useNavMobileTopPush((s) => s.toggle);

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
      className={cn(className)}
    >
      {open ? <X /> : <MenuIcon />}
    </Button>
  );
}

/* ------------------------------- Recursive list ---------------------------- */

const itemKey = (item: Menu) => `${item.label}-${item.url}`;

// Satu item. Kalau punya sub menu: teks = link, chevron = tombol buka/tutup.
function MobileMenuItem({
  item,
  open,
  onToggle,
  onNavigate,
}: {
  item: Menu;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const subId = useId();

  if (!item.sub_menu?.length) {
    return (
      <Link
        href={item.url}
        onClick={onNavigate}
        className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start px-4 py-2")}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-center py-0.5">
        {/* Klik teks: pindah ke halaman terkait */}
        <Link
          href={item.url}
          onClick={onNavigate}
          className={cn(buttonVariants({ variant: "ghost" }), "flex-1 justify-start px-4 py-2")}
        >
          {item.label}
        </Link>

        {/* Klik chevron: hanya buka/tutup submenu */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`${open ? "Tutup" : "Buka"} submenu ${item.label}`}
          aria-expanded={open}
          aria-controls={subId}
          onClick={onToggle}
        >
          <ChevronDown
            aria-hidden
            className={cn("transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
          />
        </Button>
      </div>

      <div
        id={subId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="pl-2">
            <MobileMenuList items={item.sub_menu} onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Satu level menu. Hanya satu item yang bisa terbuka dalam satu waktu.
// function MobileMenuList({ items, onNavigate }: { items: Menu[]; onNavigate: () => void }) {
//   const [openKey, setOpenKey] = useState<string | null>("next");

//   return (
//     <div className="flex flex-col">
//       {items.map((item) => {
//         const key = itemKey(item);
//         return (
//           <MobileMenuItem
//             key={key}
//             item={item}
//             open={openKey === key}
//             onToggle={() => setOpenKey(openKey === key ? null : key)}
//             onNavigate={onNavigate}
//           />
//         );
//       })}
//     </div>
//   );
// }

// Satu level menu.
// - defaultOpen: semua item yang punya submenu terbuka sejak awal
// - multiple: boleh banyak item terbuka sekaligus (kalau false, hanya satu)
function MobileMenuList({
  items,
  onNavigate,
  defaultOpen = true,
  multiple = false,
}: {
  items: Menu[];
  onNavigate: () => void;
  defaultOpen?: boolean;
  multiple?: boolean;
}) {
  const [openKeys, setOpenKeys] = useState<string[]>(() =>
    // defaultOpen ? items.filter((i) => i.sub_menu?.length).map(itemKey) : [],
    defaultOpen
      ? items
          .filter((i) => i.label === "Next")
          // .slice(0, 1)
          .map(itemKey)
      : [],
  );

  const toggle = (key: string) =>
    setOpenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : multiple ? [...prev, key] : [key]));

  return (
    <div className="flex flex-col">
      {items.map((item) => {
        const key = itemKey(item);
        return (
          <MobileMenuItem
            key={key}
            item={item}
            open={openKeys.includes(key)}
            onToggle={() => toggle(key)}
            onNavigate={onNavigate}
          />
        );
      })}
    </div>
  );
}

/* --------------------------------- Auth ------------------------------------ */

// Item terakhir jadi tombol utama (terisi), sisanya outline.
// Sama dengan aturan di versi desktop.
function MobileAuthButtons({ items, onNavigate }: { items: Menu[]; onNavigate: () => void }) {
  return (
    <div className={cn("mt-2 grid gap-2 border-t px-2 pt-3", items.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
      {items.map((item, i) => (
        <Link
          key={itemKey(item)}
          href={item.url}
          onClick={onNavigate}
          className={buttonVariants({
            variant: i === items.length - 1 ? "default" : "outline",
            className: "w-full",
          })}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

// Bagian untuk user yang sudah login: identitas, menu akun, dan tombol keluar.
function MobileUserSection({
  user,
  items,
  onSignOut,
  signOutLabel,
  onNavigate,
}: {
  user?: NavUser;
  items?: Menu[];
  onSignOut?: () => void | Promise<void>;
  signOutLabel: string;
  onNavigate: () => void;
}) {
  const hasIdentity = Boolean(user?.name || user?.email);

  return (
    <div className="mt-2 border-t px-2 pt-3">
      {hasIdentity && (
        <div className="px-2 pb-2">
          {user?.name && <p className="truncate text-sm font-medium">{user.name}</p>}
          {user?.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
        </div>
      )}

      {items && items.length > 0 && (
        <div className="flex flex-col">
          {items.map((item) => (
            <Link
              key={itemKey(item)}
              href={item.url}
              onClick={onNavigate}
              className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start px-4 py-2")}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {onSignOut && (
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start px-4 py-2 text-destructive hover:text-destructive"
          onClick={async () => {
            onNavigate();
            await onSignOut();
          }}
        >
          <LogOut aria-hidden className="size-4" />
          {signOutLabel}
        </Button>
      )}
    </div>
  );
}

/* --------------------------------- Content --------------------------------- */

type ContentProps = {
  menu: Menu[];
  /** Tombol untuk tamu (Login, Daftar). */
  authMenu?: Menu[];
  /** Menu akun untuk user yang sudah login. */
  userMenu?: Menu[];
  user?: NavUser;
  onSignOut?: () => void | Promise<void>;
  signOutLabel?: string;
  className?: string;
};

export function NavMobileTopPushContent({
  menu,
  authMenu,
  userMenu,
  user,
  onSignOut,
  signOutLabel = "Keluar",
  className = "grid md:hidden",
}: ContentProps) {
  const open = useNavMobileTopPush((s) => s.open);
  const close = useNavMobileTopPush((s) => s.close);
  const pathname = usePathname();

  // tutup saat pindah halaman
  useEffect(() => {
    close();
  }, [pathname, close]);

  // tutup dengan Escape atau klik/sentuh di luar nav mobile
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(`[${SCOPE_ATTR}]`)) return; // di dalam: abaikan
      close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  const showUserSection = Boolean(onSignOut) || Boolean(userMenu?.length);

  return (
    <div
      {...{ [SCOPE_ATTR]: "" }}
      id={PANEL_ID}
      inert={!open}
      className={cn(
        className,
        "transition-[grid-template-rows,opacity] duration-300 ease-in-out z-30 bg-background md:fixed md:right-0 md:min-h-screen md:top-0 md:bottom-0 ",
        open ? "grid-rows-[1fr] opacity-100 md:w-80" : "grid-rows-[0fr] opacity-0 md:w-0",
      )}
    >
      <div className="overflow-hidden">
        {/* satu area scroll untuk menu + tombol auth */}
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t p-2">
          <nav aria-label="Menu utama">
            <MobileMenuList items={menu} onNavigate={close} />
          </nav>

          {/* Tamu: disembunyikan lewat CSS saat data-auth="1" */}
          {authMenu && authMenu.length > 0 && (
            <nav aria-label="Akun" className="guest-only">
              <MobileAuthButtons items={authMenu} onNavigate={close} />
            </nav>
          )}

          {/* User login: disembunyikan lewat CSS saat data-auth bukan "1" */}
          {showUserSection && (
            <div className="user-only">
              <MobileUserSection
                user={user}
                items={userMenu}
                onSignOut={onSignOut}
                signOutLabel={signOutLabel}
                onNavigate={close}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
