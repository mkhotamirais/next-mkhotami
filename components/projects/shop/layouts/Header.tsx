"use client";

import Logo from "@/components/Logo";
import NavDesktopStandard from "@/components/ui/navbar/NavDesktopStandard";
import { NavMobileTopPushBtn, NavMobileTopPushContent } from "@/components/ui/navbar/NavMobileTopPush";
import NavUserMenu from "@/components/ui/navbar/NavUserMenu";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import c from "@/lib/content/shop.json";

const menu = c.menu;
const userMenu = c.user_menu;
const authMenu = c.auth_menu;

export default function Header() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <header className="min-h-16 sticky top-0 z-30 bg-background/80 backdrop-blur-2xl">
      <div className="container flex items-center justify-between min-h-16">
        <Logo />
        <div className="flex items-center gap-4">
          <NavDesktopStandard menu={menu} authMenu={user ? undefined : authMenu}>
            {user && <NavUserMenu user={user} menu={userMenu} onSignOut={signOut} />}
          </NavDesktopStandard>{" "}
          <NavMobileTopPushBtn />
        </div>
      </div>
      <NavMobileTopPushContent menu={menu} authMenu={authMenu} />
    </header>
  );
}
