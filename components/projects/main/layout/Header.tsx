import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import React from "react";

export default function Header() {
  return (
    <header className="h-16 sticky top-0 bg-white/80 dark:bg-black/80 z-30 backdrop-blur-2xl">
      <div className="container-sm flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </div>
    </header>
  );
}
