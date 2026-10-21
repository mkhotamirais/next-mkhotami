import Logo from "@/components/Logo";
import NavMobileTopPushContentAllMenu from "@/components/NavMobileContentAllMenu";
import { NavMobileTopPushBtn } from "@/components/ui/navbar/NavMobileTopPush";
import React from "react";

export default function Header() {
  return (
    <header className="min-h-16 sticky top-0 bg-white/80 dark:bg-black/80 z-30 backdrop-blur-2xl">
      <div className="container-sm flex items-center justify-between min-h-16">
        <Logo />
        <NavMobileTopPushBtn className="flex" />
      </div>
      <div className="container-sm">
        <NavMobileTopPushContentAllMenu />
      </div>
    </header>
  );
}
