import { Link } from "@/i18n/navigation";
import React, { ComponentProps } from "react";
import SwitchLangBtn from "../SwitchLangBtn";
import { LANG_MENU_KEYS } from "@/lib/constants/lang";
import { useTranslations } from "next-intl";

export default function NavDesktopLang() {
  const t = useTranslations("menu.menu");

  return (
    <div className="hidden md:flex items-center gap-2">
      <nav className="mr-4 flex">
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
      <SwitchLangBtn />
    </div>
  );
}
