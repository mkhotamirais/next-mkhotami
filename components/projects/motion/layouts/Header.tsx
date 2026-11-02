import Logo from "@/components/Logo";
import NavDesktopSingleLevel from "@/components/ui/navbar/single-level/NavDesktopSingleLevel";
import {
  NavMobileSingleLevelBtn,
  NavMobileSingleLevelContent,
} from "@/components/ui/navbar/single-level/NavMobileSingleLevel";
import { Menu } from "@/lib/types/main";
import c from "@/lib/content/motion.json";

const menu = c.menu as Menu[];

export default function Header() {
  return (
    <header className="header">
      <div className="container flex items-center justify-between h-16 border">
        <Logo />
        <NavDesktopSingleLevel menu={menu} rootPath={"/motion"} />
        <NavMobileSingleLevelBtn />
      </div>
      <NavMobileSingleLevelContent menu={menu} rootPath={"/motion"} />
    </header>
  );
}
