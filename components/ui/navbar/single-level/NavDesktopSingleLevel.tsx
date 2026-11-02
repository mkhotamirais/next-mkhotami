"use client";

import type { Menu } from "@/lib/types/main";
import { isActive } from "@/lib/utils_nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  menu: Menu[];
  rootPath: string;
  className?: string;
};

export default function NavDesktopSingleLevel({ menu, rootPath, className = "hidden md:block" }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu utama" className={className}>
      <ul className="flex gap-1">
        {menu.map((item) => {
          const active = isActive(item.url, pathname, rootPath);
          return (
            <li key={item.url}>
              <Link
                href={item.url}
                aria-current={active ? "page" : undefined}
                data-active={active}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent data-[active=true]:bg-accent"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
