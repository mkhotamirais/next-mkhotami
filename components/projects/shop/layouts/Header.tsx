"use client";

import Logo from "@/components/Logo";
import c from "@/lib/content/shop.json";
import NavDesktopSingleLevel from "@/components/ui/navbar/single-level/NavDesktopSingleLevel";
import {
  NavMobileSingleLevelBtn,
  NavMobileSingleLevelContent,
} from "@/components/ui/navbar/single-level/NavMobileSingleLevel";
import UserAuth from "./UserAuth";
import SearchContent from "./SearchContent";

const menu = c.menu;

// Selalu dirender; CSS (html[data-role="ADMIN"]) yang memilih kapan tampil.
export default function Header() {
  return (
    <header className="min-h-16 sticky top-0 z-30 bg-background/80 backdrop-blur-2xl">
      <div className="container flex items-center justify-between min-h-16">
        <Logo />
        <div className="flex items-center gap-4">
          <NavDesktopSingleLevel menu={menu} rootPath="/shop" />
          <SearchContent />
          <UserAuth />
          <NavMobileSingleLevelBtn />
        </div>
      </div>
      <NavMobileSingleLevelContent menu={menu} rootPath="/shop" />
    </header>
  );
}
