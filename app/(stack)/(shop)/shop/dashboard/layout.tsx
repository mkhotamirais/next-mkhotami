import React from "react";
import ShopProvider from "@/components/projects/shop/ShopProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ShopProvider>{children}</ShopProvider>;
}
