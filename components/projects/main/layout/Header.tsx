import Logo from "@/components/Logo";
import { NavMobileTopPushBtn, NavMobileTopPushContent } from "@/components/ui/navbar/NavMobileTopPush";
import React from "react";
import c from "@/lib/content/portfolio.json";

const menu = c.menu.find((menu) => menu.label === "Next")?.sub_menu;

export default function Header() {
  return (
    <header className="min-h-16 sticky top-0 bg-white/80 dark:bg-black/80 z-30 backdrop-blur-2xl">
      <div className="container-sm flex items-center justify-between min-h-16">
        <Logo />
        <NavMobileTopPushBtn className="flex" />
      </div>
      <div className="container-sm">
        <NavMobileTopPushContent menu={menu || []} defaultOpen={true} className="grid" />
      </div>
    </header>
  );
}
