import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import LogoutButton from "./LogoutButton";
// import { signOut } from "@/auth";

// const keluar = async () => {
//   await signOut({ redirect: false });
//   window.location.assign(new URL("/shop/redirect", window.location.origin).href);
// };

export default function UserAuth() {
  return (
    <div className="flex items-center gap-2">
      {/* Tidak login */}
      <Link href="/shop/signin" className={cn(buttonVariants({ variant: "default" }), "auth-guest")}>
        Sign in
      </Link>

      {/* Login, role user */}
      <div className="auth-user items-center gap-2">
        <span className="text-sm">
          Hi, <span className="auth-name font-medium" />
        </span>
        <LogoutButton />
        {/* <Button onClick={keluar}>Logout juga</Button> */}
      </div>

      {/* Login, role admin */}
      <div className="auth-admin items-center gap-2">
        <Link href="/shop/dashboard" className={cn(buttonVariants({ variant: "default" }))}>
          Dashboard
        </Link>
        {/* <LogoutButton /> */}
      </div>
    </div>
  );
}
