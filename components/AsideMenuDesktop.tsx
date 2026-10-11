"use client";

import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { usePathname } from "next/navigation";
import { Menu } from "@/lib/types/main";
import Logo from "./Logo";

export default function AsideMenuDesktop({ menu, path }: { menu: Menu[]; path: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block sticky w-64 p-4 pl-0 top-0">
      <Logo />
      <div className="overflow-y-auto flex flex-col mt-4 h-[calc(100vh-6rem)]">
        <h4 className="mb-2 ml-2 font-semibold capitalize">{path.replace("/", "").replace("-", " ")}</h4>
        <Link
          href={path}
          className={cn(
            buttonVariants({ variant: `${pathname === path ? "secondary" : "ghost"}`, size: "sm" }),
            "w-full justify-start",
          )}
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
            >
              {item.label}
            </Link>
          </div>
        ))}
      </div>
    </aside>
  );
}
