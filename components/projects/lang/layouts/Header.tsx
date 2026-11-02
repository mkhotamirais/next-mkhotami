import Logo from "@/components/Logo";
import { NavMobileLangBtn, NavMobileLangContent } from "./NavMobileLang";
import NavDesktopLang from "./NavDesktopLang";
import SwitchLangBtn from "../SwitchLangBtn";

export default function Header() {
  return (
    <header className="min-h-16 sticky top-0 bg-background  dark:bg-background z-30">
      <div className="container flex items-center justify-between min-h-16">
        <Logo />
        <div>
          <NavDesktopLang />
          <div className="flex items-center gap-2">
            <SwitchLangBtn className="flex md:hidden" />
            <NavMobileLangBtn />
          </div>
        </div>
      </div>
      <NavMobileLangContent />
    </header>
  );
}
