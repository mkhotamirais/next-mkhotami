import Link from "next/link";
import NavDesktopThreeLevel from "@/components/ui/navbar/three-level/NavDesktopThreeLevel";
import {
  NavMobileThreeLevelBtn,
  NavMobileThreeLevelContent,
} from "@/components/ui/navbar/three-level/NavMobileThreeLevel";
import c from "@/lib/content/navbar.json";

const menu = c.three_level_menu;
const rootPath = "/components/navbar";

export default function HeaderNavThreeLevel() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          Logo
        </Link>
        <NavDesktopThreeLevel menu={menu} rootPath={rootPath} />
        <NavMobileThreeLevelBtn />
      </div>

      {/* di dalam <header>, di bawah bar: inilah yang membuat header memanjang dan mendorong konten */}
      <NavMobileThreeLevelContent menu={menu} rootPath={rootPath} />
    </header>
  );
}
