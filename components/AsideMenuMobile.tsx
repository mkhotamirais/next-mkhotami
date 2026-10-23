"use client";

import Logo from "./Logo";
import { Menu as TMenu } from "@/lib/types/main";
import { NavMobileTopPushBtn, NavMobileTopPushContent } from "./ui/navbar/NavMobileTopPush";

type Props = {
  menu: TMenu[];
};

export default function AsideMenuMobile({ menu }: Props) {
  return (
    <header className="bg-background w-full sticky top-0 z-30 block md:hidden">
      <div className="container flex items-center justify-between min-h-16 w-full">
        <Logo />
        <NavMobileTopPushBtn />
      </div>
      <NavMobileTopPushContent menu={menu} />
    </header>
  );
}
