"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Menu } from "@/lib/types/main";
import { itemKey, matchesPath, navLinkClass, pickActive } from "@/lib/utils_nav";

export type NavUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// Inisial dari nama (maks. 2 huruf), atau huruf pertama email.
export function initials({ name, email }: NavUser) {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (words.length) {
    return words
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }
  return email?.trim()[0]?.toUpperCase() ?? "";
}

// function Avatar({ user }: { user: NavUser }) {
//   if (user.image) {
//     // <img> biasa agar tidak perlu mendaftarkan domain di next.config.
//     // eslint-disable-next-line @next/next/no-img-element
//     return <img src={user.image} alt="" referrerPolicy="no-referrer" className="size-full object-cover" />;
//   }

//   const text = initials(user);
//   return text ? <span aria-hidden>{text}</span> : <UserIcon aria-hidden className="size-4" />;
// }

function Avatar({ user }: { user: NavUser }) {
  if (user.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.image} alt="" referrerPolicy="no-referrer" className="size-full object-cover" />;
  }

  const text = initials(user);
  if (text) return <span aria-hidden>{text}</span>;

  // Data user belum datang: pakai cache dari CSS variable, atau icon generik
  return (
    <>
      <UserIcon aria-hidden className="avatar-generic size-4" />
      <span aria-hidden className="avatar-cached" />
    </>
  );
}

type Props = {
  user: NavUser;
  /** Isi dropdown. Tentukan sesuai peran di sisi pemanggil. */
  menu?: Menu[];
  /** Fungsi keluar, biasanya Server Action. Tanpa ini, tombol keluar tidak tampil. */
  onSignOut?: () => void | Promise<void>;
  signOutLabel?: string;
  /** Label aksesibilitas untuk tombol profil. */
  label?: string;
};

export default function NavUserMenu({
  user,
  menu = [],
  onSignOut,
  signOutLabel = "Keluar",
  label = "Menu akun",
}: Props) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // Menyimpan halaman tempat menu dibuka. Menu terbuka hanya selama masih di
  // halaman yang sama, jadi pindah halaman otomatis menutupnya tanpa effect.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const close = () => setOpenedAt(null);

  const activeItem = pickActive(menu, pathname);

  // Tutup dengan Escape atau klik/sentuh di luar. Aktif hanya saat terbuka.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpenedAt(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenedAt(null);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const hasIdentity = Boolean(user.name || user.email);

  return (
    <div ref={rootRef} className="relative user-only">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        data-active={Boolean(activeItem)}
        onClick={() => setOpenedAt(open ? null : pathname)}
        className={cn(
          "relative inline-flex size-9 items-center justify-center overflow-hidden rounded-full border bg-accent text-xs font-semibold transition-colors",
          "outline-none hover:bg-accent/70 focus-visible:ring-2 focus-visible:ring-ring",
          "aria-expanded:bg-accent/70 data-[active=true]:border-primary",
        )}
      >
        <Avatar user={user} />
      </button>

      <div
        id={panelId}
        inert={!open}
        className={cn(
          "absolute right-0 top-full z-50 mt-1 w-56 origin-top-right rounded-lg border bg-popover p-1 text-popover-foreground",
          "transition-[opacity,translate,scale,visibility] motion-reduce:transition-none",
          open
            ? "visible translate-y-0 scale-100 opacity-100 duration-200 ease-out"
            : "invisible -translate-y-1 scale-95 opacity-0 duration-150 ease-in",
        )}
      >
        {hasIdentity && (
          <div className="px-2 py-1.5">
            {user.name && <p className="truncate text-sm font-medium">{user.name}</p>}
            {user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
          </div>
        )}

        {menu.length > 0 && (
          <>
            {hasIdentity && <div role="separator" className="my-1 border-t" />}
            <nav aria-label={label} className="flex flex-col">
              {menu.map((item) => (
                <Link
                  key={itemKey(item)}
                  href={item.url}
                  onClick={close}
                  aria-current={item === activeItem && matchesPath(item.url, pathname) ? "page" : undefined}
                  data-active={item === activeItem}
                  className={navLinkClass("w-full justify-start")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </>
        )}

        {onSignOut && (
          <>
            {(hasIdentity || menu.length > 0) && <div role="separator" className="my-1 border-t" />}
            <form action={onSignOut}>
              <button
                type="submit"
                className={navLinkClass("w-full justify-start text-destructive hover:text-destructive")}
              >
                <LogOut aria-hidden className="size-4" />
                {signOutLabel}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
