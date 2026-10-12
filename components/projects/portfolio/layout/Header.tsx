import React from "react";
import c from "@/lib/content/portfolio.json";
import NavDesktopStandard from "@/components/ui/navbar/NavDesktopStandard";
import { NavMobileTopPushBtn, NavMobileTopPushContent } from "@/components/ui/navbar/NavMobileTopPush";
import Logo from "@/components/Logo";

const menu = c.menu;

export default function Header() {
  return (
    <header className="border-b min-h-16 sticky top-0 bg-background/80 z-30 backdrop-blur">
      <div className="container-sm min-h-16 flex justify-between items-center">
        <Logo />
        <div>
          <NavDesktopStandard menu={menu} />
          <NavMobileTopPushBtn />
        </div>
      </div>
      <NavMobileTopPushContent menu={menu} />
    </header>
  );
}
