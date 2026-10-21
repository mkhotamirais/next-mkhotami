"use client";

import { usePathname } from "next/navigation";
import NextProjectsMenu from "./NextProjectsMenu";

export default function RouteTitle() {
  const pathname = usePathname();
  const title = pathname.split("/").pop()?.replace(/-/g, " ");

  return (
    <div className="flex items-center justify-between">
      <h1 className="h1">{title ?? "Next Satu"}</h1>
      <NextProjectsMenu />
    </div>
  );
}
