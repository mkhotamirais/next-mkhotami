import Footer from "@/components/projects/main/layout/Footer";
import Header from "@/components/projects/shop/layouts/Header";
import { NextAuthProviders } from "@/components/providers/NextAuthProvider";
import React from "react";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProviders>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </NextAuthProviders>
  );
}
