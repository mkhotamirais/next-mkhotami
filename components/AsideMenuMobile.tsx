"use client";

import { Menu } from "lucide-react";
import React, { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "cn";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { Menu as TMenu } from "@/lib/types/main";

export default function AsideMenuMobile({ menu, path }: { menu: TMenu[]; path: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <header className="block md:hidden sticky top-0 h-16 bg-white dark:bg-black z-30">
      <div className="container flex items-center justify-between h-full">
        <Logo />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "font-semibold")}
            onClick={handleClose}
          >
            <Menu className="mr-1 size-4" /> <span className="pt-0.5">MENU</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
              <SheetDescription className="hidden"></SheetDescription>
            </SheetHeader>
            <div className="overflow-y-auto flex flex-col h-[calc(100vh-6rem)] px-2">
              <h4 className="mb-2 ml-2 font-semibold capitalize">{path.replace("/", "").replace("-", " ")}</h4>
              <Link
                href={path}
                className={cn(
                  buttonVariants({ variant: `${pathname === path ? "secondary" : "ghost"}`, size: "sm" }),
                  "w-full justify-start",
                )}
                onClick={handleClose}
              >
                Overview
              </Link>
              {menu?.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.url}
                    className={cn(
                      buttonVariants({ variant: `${pathname === item.url ? "secondary" : "ghost"}`, size: "sm" }),
                      "w-full justify-start",
                    )}
                    onClick={handleClose}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
