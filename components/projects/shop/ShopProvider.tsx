"use client";

import AsideProvider from "@/components/providers/AsideProvider";
import { useSession } from "next-auth/react";
import React from "react";
import LogoutButton from "./layouts/LogoutButton";
import c from "@/lib/content/shop.json";

const menu = c.admin_menu;

export default function ShopProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <AsideProvider menu={menu} isLogin={!!user} logoutButton={<LogoutButton />}>
      {children}
    </AsideProvider>
  );
}
