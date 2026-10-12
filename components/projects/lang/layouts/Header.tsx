import Logo from "@/components/Logo";
import { NavMobileLangBtn, NavMobileLangContent } from "./NavMobileLang";
import NavDesktopLang from "./NavDesktopLang";

export default function Header() {
  return (
    <header className="min-h-16 sticky top-0 bg-background  dark:bg-background z-30">
      <div className="container flex items-center justify-between min-h-16">
        <Logo />
        <div>
          <NavDesktopLang />
          <NavMobileLangBtn />
        </div>
      </div>
      <NavMobileLangContent />
    </header>
  );
}
