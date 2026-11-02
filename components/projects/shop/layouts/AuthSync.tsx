"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

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

    const role = isLoggedIn ? (user.role === "ADMIN" ? "ADMIN" : "USER") : "guest";
    const name = isLoggedIn ? (user.name ?? user.email ?? "") : "";

    try {
      if (isLoggedIn) {
        localStorage.setItem("auth_user", JSON.stringify({ name, role }));
      } else {
        localStorage.removeItem("auth_user");
      }
    } catch {}

    if (name) root.style.setProperty("--auth-name", JSON.stringify(name));
    else root.style.removeProperty("--auth-name");

    if (root.dataset.role !== role) root.dataset.role = role;
  }, [session, status]);

  return null;
}
