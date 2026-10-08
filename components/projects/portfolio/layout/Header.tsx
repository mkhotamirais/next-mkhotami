import Logo from "@/components/Logo";
import React from "react";
import c from "@/lib/content/portfolio.json";
import Link from "next/link";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import NavDesktopV3 from "./NavDesktop";
import NavDesktop from "./NavDesktop";

const menu = c.menu;

export default function Header() {
  return (
    <header className="border-b min-h-16 sticky top-0 bg-background">
      <div className="container min-h-16">
        <NavDesktop menu={menu} />
        {/* <Logo />
        <nav>
          {menu.map((item, i) => (
            <Link key={i} href={item.url} className={cn(buttonVariants({ variant: "link" }), "")}>
              {item.label}
            </Link>
          ))}
        </nav> */}
      </div>
    </header>
  );
}
