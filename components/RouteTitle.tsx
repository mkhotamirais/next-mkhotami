"use client";

import { usePathname } from "next/navigation";

export default function RouteTitle() {
  const pathname = usePathname();
  const title = pathname.split("/").pop()?.replace(/-/g, " ");

  return <h1 className="h1">{title ?? "Next Satu"}</h1>;
}
