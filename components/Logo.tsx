import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-1", className)}>
      <Image
        src="/images/logos/logo-mkhotami.png"
        alt="MKHotami Logo"
        width={50}
        height={50}
        priority
        className={"size-10"}
      />
      <div className="flex flex-col">
        <span className="font-semibold text-sm">MKHOTAMI</span>
        <span className="text-[10px] tracking-tight font-light">WEB DEVELOPER</span>
      </div>
    </Link>
  );
}
