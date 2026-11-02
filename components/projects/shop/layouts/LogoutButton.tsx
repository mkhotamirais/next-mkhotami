"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type Props = {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

export default function LogoutButton({ className, variant = "ghost" }: Props) {
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (pending) return;
    setPending(true);

    try {
      // Hapus session di server. Tanpa redirect, supaya navigasi dikendalikan di bawah.
      await signOut({ redirect: false });
    } finally {
      // Pemuatan penuh ke titik sinkron: proxy tidak menemukan session,
      // menghapus auth_hint, auth_role, dan auth_name, lalu mengalihkan ke /shop.
      window.location.assign(new URL("/shop/redirect", window.location.origin).href);
    }
  }

  return (
    <Button type="button" variant={variant} size="sm" onClick={handleLogout} disabled={pending} className={className}>
      <LogOut className="mr-0 size-3.5 text-destructive!" />
      Logout
    </Button>
  );
}
