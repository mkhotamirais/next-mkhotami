"use client";

import AsideProvider from "@/components/providers/AsideProvider";
import { useSession } from "next-auth/react";
import React from "react";
import c from "@/lib/content/shop.json";
import LogoutButton from "./layouts/LogoutButton";

const menu = c.admin_menu;

export default function ShopProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;

  const listChildren = (
    <>
      <li className="mt-3 auth-member">
        <LogoutButton className="w-full justify-start text-destructive hover:text-destructive/80" />
      </li>
    </>
  );

  return (
    <AsideProvider menu={menu} isLogin={!!user} listChildren={listChildren}>
      {children}
    </AsideProvider>
  );
}
