import Link from "next/link";
import NavDesktopSingleLevel from "@/components/ui/navbar/single-level/NavDesktopSingleLevel";
import {
  NavMobileSingleLevelBtn,
  NavMobileSingleLevelContent,
} from "@/components/ui/navbar/single-level/NavMobileSingleLevel";
import c from "@/lib/content/navbar.json";

const menu = c.single_level_menu;
const rootPath = "/components/navbar";

export default function HeaderNavSingleLevel() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          Logo
        </Link>
        <NavDesktopSingleLevel menu={menu} rootPath={rootPath} />
        <NavMobileSingleLevelBtn />
      </div>

      {/* di dalam <header>, di bawah bar: inilah yang membuat header memanjang dan mendorong konten */}
      <NavMobileSingleLevelContent menu={menu} rootPath={rootPath} />
    </header>
  );
}
