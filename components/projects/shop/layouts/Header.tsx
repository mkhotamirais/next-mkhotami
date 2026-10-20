"use client";

import Logo from "@/components/Logo";
import NavDesktopStandard from "@/components/ui/navbar/NavDesktopStandard";
import { NavMobileTopPushBtn, NavMobileTopPushContent } from "@/components/ui/navbar/NavMobileTopPush";
import NavUserMenu, { type NavUser } from "@/components/ui/navbar/NavUserMenu";
import { signOut, useSession } from "next-auth/react";
import c from "@/lib/content/shop.json";
import { useRouter } from "next/navigation";

const menu = c.menu;
const userMenu = c.user_menu;
const authMenu = c.auth_menu;

const EMPTY_USER: NavUser = {};

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSignOut() {
    try {
      localStorage.removeItem("auth_user"); // boleh dihapus kalau cache avatar sudah tidak dipakai
    } catch {}

    await signOut({ redirect: false });

    // Hapus petunjuk setelah session benar-benar hilang di server
    document.cookie = "auth_hint=; path=/; max-age=0; SameSite=Lax";
    document.documentElement.dataset.auth = "0";

    router.replace("/shop");
    router.refresh();
  }

  return (
    <header className="min-h-16 sticky top-0 z-30 bg-background/80 backdrop-blur-2xl">
      <div className="container flex items-center justify-between min-h-16">
        <Logo />
        <div className="flex items-center gap-4">
          <NavDesktopStandard menu={menu} authMenu={authMenu}>
            <NavUserMenu user={session?.user ?? EMPTY_USER} menu={userMenu} onSignOut={handleSignOut} />
          </NavDesktopStandard>
          <NavMobileTopPushBtn />
        </div>
      </div>
      <NavMobileTopPushContent menu={menu} authMenu={authMenu} />
    </header>
  );
}
