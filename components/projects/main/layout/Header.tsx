import Logo from "@/components/Logo";
import React from "react";
import { FaGithub } from "react-icons/fa6";

export default function Header() {
  return (
    <header className="min-h-16 sticky top-0 bg-white/80 dark:bg-black/80 z-30 backdrop-blur-2xl">
      <div className="container-sm flex items-center justify-between min-h-16">
        <Logo />
        <a href="https://github.com/mkhotamirais">
          <FaGithub size={24} />
        </a>
      </div>
    </header>
  );
}
