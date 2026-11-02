"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

// Kunci dan penanda ini ditulis/dibaca oleh skrip di <head> dan oleh Header.
// Kalau kamu menambah atau mengganti kuncinya di sana, ubah di sini juga.
const STORAGE_KEYS = ["auth_user", "auth_role"];

/** Hapus semua penanda login di sisi browser (tampilan saja, bukan session). */
export function clearAuthClientState() {
  try {
    STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {}

  document.cookie = "auth_hint=; path=/; max-age=0; SameSite=Lax";

  const root = document.documentElement;
  root.dataset.auth = "0";
  delete root.dataset.role;
  delete root.dataset.avatar;
  root.style.removeProperty("--user-image");
  root.style.removeProperty("--user-initials");
}

type Options = {
  /** Tujuan setelah keluar. */
  redirectTo?: string;
};

export function useSignOut({ redirectTo = "/shop" }: Options = {}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSignOut = useCallback(async () => {
    if (pending) return; // cegah klik ganda
    setPending(true);

    try {
      await signOut({ redirect: false });

      // Bersihkan penanda hanya setelah session benar-benar hilang di server.
      clearAuthClientState();

      router.replace(redirectTo);
      router.refresh();
    } finally {
      setPending(false);
    }
  }, [pending, redirectTo, router]);

  return { handleSignOut, pending };
}
