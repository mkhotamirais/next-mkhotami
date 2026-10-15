import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import Link from "next/link";
import React from "react";

export default function AuthBtn() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/shop/signin" className={cn(buttonVariants({ variant: "default" }))}>
        Sign in
      </Link>
      <Link href="/shop/signup" className={cn(buttonVariants({ variant: "secondary" }))}>
        Sign up
      </Link>
    </div>
  );
}
