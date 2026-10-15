import Footer from "@/components/projects/main/layout/Footer";
import Header from "@/components/projects/shop/layouts/Header";
import React from "react";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
