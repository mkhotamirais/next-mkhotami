import HeaderNavSingleLevel from "@/components/projects/components/layouts/HeaderNavSingleLevel";
import HeaderNavThreeLevel from "@/components/projects/components/layouts/HeaderNavThreeLevel";
import HeaderNavTwoLevel from "@/components/projects/components/layouts/HeaderNavTwoLevel";
import React from "react";

export default function NavbarLayout({ children }: { children: React.ReactNode }) {
  return (
    // <div className="max-h-dvh border rounded-xl overflow-y-scroll overflow-x-visible">
    <>
      <HeaderNavSingleLevel />
      <HeaderNavTwoLevel />
      <HeaderNavThreeLevel />
      <div className="container min-h-screen">{children}</div>
    </>
    // </div>
  );
}
