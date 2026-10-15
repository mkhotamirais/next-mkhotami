import Logo from "@/components/Logo";
import NavDesktopStandard from "@/components/ui/navbar/NavDesktopStandard";
import React from "react";
import c from "@/lib/content/shop.json";
import { NavMobileTopPushBtn, NavMobileTopPushContent } from "@/components/ui/navbar/NavMobileTopPush";

const user = null;

const authMenu = user
  ? []
  : [
      { label: "Sign In", url: "/shop/signin" },
      { label: "Sign Up", url: "/shop/signup" },
    ];

const menu = c.menu;

export default function Header() {
  return (
    <header className="min-h-16 sticky top-0 z-30 bg-background/80 backdrop-blur-2xl">
      <div className="container flex items-center justify-between min-h-16">
        <Logo />
        <div className="flex items-center gap-4">
          <NavDesktopStandard menu={menu} authMenu={authMenu} />
          <NavMobileTopPushBtn />
        </div>
      </div>
      <NavMobileTopPushContent menu={menu} authMenu={authMenu} />
    </header>
  );
}
