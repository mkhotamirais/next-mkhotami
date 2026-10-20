"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { initials } from "@/components/ui/navbar/NavUserMenu";

const MAX_AGE = 60 * 60 * 24 * 30; // samakan dengan umur auth_hint di proxy.ts

export function AuthSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const user = session?.user;
    const isLoggedIn = status === "authenticated" && !!user;
    const root = document.documentElement;
    const hint = /(^|; )auth_hint=1/.test(document.cookie);

    // Koreksi cadangan: hanya menulis kalau petunjuk berbeda dari session asli
    if (isLoggedIn !== hint) {
      document.cookie = isLoggedIn
        ? `auth_hint=1; path=/; max-age=${MAX_AGE}; SameSite=Lax`
        : "auth_hint=; path=/; max-age=0; SameSite=Lax";
    }

    try {
      if (isLoggedIn) {
        localStorage.setItem("auth_user", JSON.stringify({ i: initials(user), img: user.image ?? null }));
      } else {
        localStorage.removeItem("auth_user");
        delete root.dataset.avatar;
        root.style.removeProperty("--user-initials");
        root.style.removeProperty("--user-image");
      }
    } catch {}

    const next = isLoggedIn ? "1" : "0";
    if (root.dataset.auth !== next) root.dataset.auth = next;
  }, [session, status]);

  return null;
}
