import Header from "@/components/projects/portfolio/layout/Header";
import React from "react";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex-1 container">{children}</div>
      <div>footer</div>
    </>
  );
}
