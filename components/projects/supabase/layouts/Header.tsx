import Logo from "@/components/Logo";
import React from "react";

export default function Header() {
  return (
    <header className="bg-background sticky top-0 z-30 min-h-16">
      <div className="container flex items-center justify-between">
        <Logo />
        <div>menu</div>
      </div>
    </header>
  );
}
