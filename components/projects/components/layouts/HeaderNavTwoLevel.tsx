import Link from "next/link";
import NavDesktopTwoLevel from "@/components/ui/navbar/two-level/NavDesktopTwoLevel";
import { NavMobileTwoLevelBtn, NavMobileTwoLevelContent } from "@/components/ui/navbar/two-level/NavMobileTwoLevel";
import c from "@/lib/content/navbar.json";

const menu = c.two_level_menu;
const rootPath = "/components/navbar";

export default function HeaderNavTwoLevel() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          Logo
        </Link>
        <NavDesktopTwoLevel menu={menu} rootPath={rootPath} />
        <NavMobileTwoLevelBtn />
      </div>

      {/* di dalam <header>, di bawah bar: inilah yang membuat header memanjang dan mendorong konten */}
      <NavMobileTwoLevelContent menu={menu} rootPath={rootPath} />
    </header>
  );
}
