import Footer from "@/components/projects/main/layout/Footer";
import Header from "@/components/projects/portfolio/layout/Header";
import React from "react";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex-1 container-sm">{children}</div>
      <Footer container="container-sm" />
    </>
  );
}
