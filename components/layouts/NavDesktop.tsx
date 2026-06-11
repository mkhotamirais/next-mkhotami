import { menu } from "@/lib/content";
import Link from "next/link";
import React from "react";

export default function NavDesktop() {
  return (
    <div className="hidden md:flex items-center space-x-4">
      {menu.map((item) => (
        <Link key={item.name} href={item.href} className="text-gray-600 hover:text-gray-900">
          {item.name}
        </Link>
      ))}
    </div>
  );
}
