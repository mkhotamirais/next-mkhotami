import AsideProvider from "@/components/providers/AsideProvider";
import React from "react";
import c from "@/lib/content/shop.json";

const menu = c.admin_menu;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AsideProvider menu={menu}>{children}</AsideProvider>;
}
