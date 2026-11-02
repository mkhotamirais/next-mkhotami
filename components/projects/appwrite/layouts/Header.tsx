"use client";

import Logo from "@/components/Logo";
import c from "@/lib/content/appwrite.json";
import NavDesktopSingleLevel from "@/components/ui/navbar/single-level/NavDesktopSingleLevel";
import {
  NavMobileSingleLevelBtn,
  NavMobileSingleLevelContent,
} from "@/components/ui/navbar/single-level/NavMobileSingleLevel";
import UserAuth from "./UserAuth";

const menu = c.menu;

export default function Header() {
  return (
    <header className="bg-background sticky top-0 z-30 min-h-16">
      <div className="container flex items-center justify-between min-h-16">
        <Logo />
        <div className="flex items-center gap-2">
          <NavDesktopSingleLevel menu={menu} rootPath="/appwrite" />
          <UserAuth />
          <NavMobileSingleLevelBtn />
        </div>
      </div>
      <NavMobileSingleLevelContent menu={menu} rootPath="/appwrite" />
    </header>
  );
}
