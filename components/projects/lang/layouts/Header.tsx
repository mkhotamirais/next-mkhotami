import Logo from "@/components/Logo";
import SwitchLangBtn from "../SwitchLangBtn";
import { LANG_MENU_KEYS } from "@/lib/constants/lang";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ComponentProps } from "react";

export default function Header() {
  const t = useTranslations("menu.menu");
  return (
    <header className="h-16 sticky top-0 bg-background  dark:bg-background z-30">
      <div className="container flex items-center justify-between">
        <Logo />
        <nav>
          {/* <Link href="/lang/about">halo</Link> */}
          {LANG_MENU_KEYS.map((item, i) => (
            <Link
              key={i}
              href={t(`${item}.url`) as ComponentProps<typeof Link>["href"]}
              className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {t(`${item}.label`)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <SwitchLangBtn />
        </div>
      </div>
    </header>
  );
}
