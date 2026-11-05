"use client";

import { cn } from "cn";

export default function DropdownPanel() {
  return (
    <div className="p-10">
      <div className="group relative inline-block">
        <a href="#" className="rounded border px-3 py-1">
          Produk
        </a>

        <div
          className={cn(
            "invisible opacity-0 -translate-y-1 scale-95 delay-150",
            "group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:delay-0",
            "group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:delay-0",
            "origin-top-left transition-all duration-200 ease-out",
            "absolute left-0 top-full mt-1 w-48 rounded-lg border bg-popover p-1",
          )}
        >
          <a href="#a" className="block px-2 py-1">
            Item A
          </a>
          <a href="#b" className="block px-2 py-1">
            Item B
          </a>
        </div>
      </div>
    </div>
  );
}
