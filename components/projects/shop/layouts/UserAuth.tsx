import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import UserMenuDesktop from "./UserMenuDesktop";
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
      {/* <div className="auth-user items-center gap-2">
        <span className="text-sm">
          Hi, <span className="auth-name font-medium" />
        </span>
        <LogoutButton />
      </div> */}
      <UserMenuDesktop />

      {/* Login, role admin */}
      <Link href="/shop/dashboard" className={cn(buttonVariants({ variant: "default" }), "auth-admin")}>
        Dashboard
      </Link>
    </div>
  );
}
