import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import React from "react";

export default function Footer({ container = "container" }: { container?: string }) {
  return (
    <footer className="pb-4 pt-8 border-t">
      <div className={`${container}`}>
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <ThemeToggle />
        </div>
        <p className="text-xs text-center">
          Build with Next.js and deployed on Vercel and Posts written in Markdown by Mkhotami
        </p>
      </div>
    </footer>
  );
}
