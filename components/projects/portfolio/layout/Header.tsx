import React from "react";
import c from "@/lib/content/portfolio.json";
import NavDesktopStandard from "@/components/ui/navbar/NavDesktopStandard";

const menu = c.menu;

export default function Header() {
  return (
    <header className="border-b min-h-16 sticky top-0 bg-background/80 z-30 backdrop-blur">
      <div className="container-sm min-h-16">
        <NavDesktopStandard menu={menu} />
      </div>
    </header>
  );
}
