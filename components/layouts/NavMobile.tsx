"use client";

import React from "react";
import { Menu } from "lucide-react";
// import { useMenu } from "@/hooks/zustand/useMenu";
import { cn } from "@/lib/utils";
import Logo from "../Logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { menu } from "@/lib/content";
import Link from "next/link";

export default function NavMobile() {
  // const { isOpen, toggleMenu } = useMenu();

  return (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger aria-label="Toggle Menu">
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="">
            <SheetTitle className=" w-fit">
              <Logo />
            </SheetTitle>
            <SheetDescription className="sr-only">Mobile Menu</SheetDescription>
          </SheetHeader>
          <div className="px-3">
            {menu.map((item) => (
              <SheetClose key={item.name} asChild>
                <Link href={item.href} className="block py-2 text-gray-600 hover:text-gray-900">
                  {item.name}
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
