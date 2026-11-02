import Header from "@/components/projects/shop/layouts/Header";
import React from "react";

export default function ShopPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="container flex-1">{children}</main>
    </>
  );
}
