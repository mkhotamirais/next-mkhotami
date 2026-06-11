"use client";

import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ShowBackHomeRoutes = ["/portfolio-1"];

export default function BackHome() {
  const pathname = usePathname();

  if (!ShowBackHomeRoutes.includes(pathname)) {
    return null;
  }

  return (
    <Link
      href="/"
      className="z-50 flex items-center border rounded fixed bottom-4 right-4 bg-white px-3 py-2 shadow-lg"
    >
      <HomeIcon className="mr-2" />
      Back Home
    </Link>
  );
}
