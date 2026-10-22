"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import React, { ComponentProps, useEffect } from "react";
import { useNavMobileLang } from "./useNavMobileLang";
import { cn } from "cn";
import { LANG_MENU_KEYS } from "@/lib/constants/lang";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const PANEL_ID = "nav-mobile-top-push";

// penanda area "di dalam" nav mobile (tombol + panel)
const SCOPE_ATTR = "data-nav-mobile-top-push";

export function NavMobileLangContent() {
  const { open, close } = useNavMobileLang();
  const t = useTranslations("menu.menu");
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

  return (
    <div
      {...{ [SCOPE_ATTR]: "" }}
      id={PANEL_ID}
      inert={!open}
      className={cn(
        "grid md:hidden transition-[grid-template-rows] duration-300 ease-in-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="overflow-hidden">
        <div className="py-4 px-4 border-b">
          {LANG_MENU_KEYS.map((item, i) => (
            <Link
              key={i}
              href={t(`${item}.url`) as ComponentProps<typeof Link>["href"]}
              className={cn(buttonVariants({ variant: "ghost" }), "block py-2 px-4 hover:bg-gray-200")}
            >
              {t(`${item}.label`)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NavMobileLangBtn({ className = "md:hidden" }: { className?: string }) {
  const { toggle, open } = useNavMobileLang();
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
      className={className}
    >
      {open ? <X /> : <MenuIcon />}
    </Button>
  );
}
