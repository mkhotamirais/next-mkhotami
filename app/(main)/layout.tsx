import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
