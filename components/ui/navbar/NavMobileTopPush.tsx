"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { Menu } from "@/lib/types/main";
import { useNavMobileTopPush } from "./useNavMobileTopPush";

const PANEL_ID = "nav-mobile-top-push";
// penanda area "di dalam" nav mobile (tombol + panel)
const SCOPE_ATTR = "data-nav-mobile-top-push";

/* ---------------------------------- Button --------------------------------- */

export function NavMobileTopPushBtn() {
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
      className="md:hidden"
    >
      {open ? <X /> : <MenuIcon />}
    </Button>
  );
}

/* ------------------------------- Recursive list ---------------------------- */

// Satu Accordion per level: item yang bersaudara berbagi induk yang sama,
// jadi hanya satu yang bisa terbuka dalam satu waktu (Base UI: multiple = false).
function MobileMenuList({ items, onNavigate }: { items: Menu[]; onNavigate: () => void }) {
  return (
    <Accordion>
      {items.map((item) =>
        item.sub_menu?.length ? (
          <AccordionItem key={`${item.label}-${item.url}`} value={item.label} className="border-b-0">
            <AccordionTrigger
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-between px-4 py-2 hover:no-underline",
              )}
            >
              {item.label}
            </AccordionTrigger>
            <AccordionContent className="pb-0 pl-2">
              <MobileMenuList items={item.sub_menu} onNavigate={onNavigate} />
            </AccordionContent>
          </AccordionItem>
        ) : (
          <Link
            key={`${item.label}-${item.url}`}
            href={item.url}
            onClick={onNavigate}
            className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start px-4 py-2")}
          >
            {item.label}
          </Link>
        ),
      )}
    </Accordion>
  );
}

/* --------------------------------- Content --------------------------------- */

export function NavMobileTopPushContent({ menu }: { menu: Menu[] }) {
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

  return (
    <div
      {...{ [SCOPE_ATTR]: "" }}
      id={PANEL_ID}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="overflow-hidden">
        <nav aria-label="Menu utama" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t p-2">
          {menu && <MobileMenuList items={menu} onNavigate={close} />}
        </nav>
      </div>
    </div>
  );
}
