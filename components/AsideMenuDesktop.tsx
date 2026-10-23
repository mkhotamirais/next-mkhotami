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

  const linkClass = (active: boolean) =>
    cn(buttonVariants({ variant: active ? "secondary" : "ghost", size: "sm" }), "w-full justify-start");

  return (
    <aside className="sticky top-0 hidden max-h-dvh w-56 self-start flex-col p-4 pl-0 md:flex">
      <div className="shrink-0">
        <Logo />
      </div>

      <nav className="mt-4 min-h-0 flex-1 overflow-y-auto" aria-label={path.replace("/", "")}>
        <h2 className="mb-2 ml-2 font-semibold capitalize">{path.replace("/", "").replaceAll("-", " ")}</h2>
        <ul className="flex flex-col">
          <li>
            <Link
              href={path}
              className={linkClass(pathname === path)}
              aria-current={pathname === path ? "page" : undefined}
            >
              Overview
            </Link>
          </li>
          {menu?.map((item) => (
            <li key={item.label}>
              <Link
                href={item.url}
                className={linkClass(pathname === item.url)}
                aria-current={pathname === item.url ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
