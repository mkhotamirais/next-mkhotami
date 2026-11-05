"use client";

import { useCallback, useState } from "react";
import { signOut, useSession } from "next-auth/react";

type Options = {
  /** Path tujuan setelah session dihapus. Dimuat penuh supaya proxy dan skrip di <head> berjalan lagi. */
  redirectTo?: string;
};

export function useAuth({ redirectTo = "/shop/redirect" }: Options = {}) {
  const [pendingLogout, setPendingLogout] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const initial = user?.email?.charAt(0).toUpperCase() || "U";

  const logout = useCallback(async () => {
    if (pendingLogout) return;
    setPendingLogout(true);

    try {
      // Hapus session di server. Tanpa redirect, supaya navigasi dikendalikan di bawah.
      await signOut({ redirect: false });
    } finally {
      // Pemuatan penuh ke titik sinkron. `pending` tidak perlu dikembalikan ke false
      // karena halaman dimuat ulang.
      window.location.assign(new URL(redirectTo, window.location.origin).href);
    }
  }, [pendingLogout, redirectTo]);

  return { logout, pendingLogout, user, initial };
}
