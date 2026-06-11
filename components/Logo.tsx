import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center space-x-2">
      <span className="text-lg font-bold">NEXT</span>
      <span>MKHOTAMI</span>
    </Link>
  );
}
