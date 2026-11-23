import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  className?: string;
};

export default function Logo({ className }: Props) {
  return (
    <Link href="/" className={cn("flex items-center gap-1 w-auto h-14", className)}>
      <Image
        src="/images/logos/logo-ota-icon-text-square.png"
        alt="MKHotami Logo"
        width={200}
        height={200}
        priority
        className={"w-full h-full"}
      />
      {/* <div className={cn("flex flex-col", textWhite && "*:text-gray-300")}>
        <span className="font-semibold text-sm">MKHOTAMI</span>
        <span className="text-[10px] tracking-tight font-light">WEB DEVELOPER</span>
      </div> */}
    </Link>
  );
}
