import React from "react";
import NavDesktopStandard from "./ui/navbar/NavDesktopStandard";
import c from "@/lib/content/portfolio.json";

const menu = c.menu.filter((menu) => menu.label === "Next");

export default function NextProjectsMenu() {
  return <NavDesktopStandard menu={menu} className="flex" />;
}
