import React from "react";
import c from "@/lib/content/portfolio.json";
import { NavMobileTopPushContent } from "./ui/navbar/NavMobileTopPush";

const menu = c.menu;

export default function NavMobileTopPushContentAllMenu({ className = "grid" }: { className?: string }) {
  return <NavMobileTopPushContent menu={menu} className={className} />;
}
