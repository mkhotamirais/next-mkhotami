import type { NextRequest, NextResponse } from "next/server";

const MAX_AGE = 60 * 60 * 24 * 30; // samakan dengan umur session JWT
const COOKIES = ["auth_hint", "auth_role", "auth_name"] as const;

export type ShopHintUser = { role?: string | null; name?: string | null; email?: string | null } | undefined;

// Penanda tampilan saja (bukan keamanan). Sengaja tidak httpOnly
// supaya script di <head> bisa membacanya sebelum cat pertama.
export function shopSyncAuth(req: NextRequest, res: NextResponse, user: ShopHintUser) {
  const options = {
    path: "/",
    maxAge: MAX_AGE,
    sameSite: "lax" as const,
    secure: req.nextUrl.protocol === "https:",
    httpOnly: false,
  };

  const name = (user?.name ?? user?.email ?? "").slice(0, 60);
  const values: Record<(typeof COOKIES)[number], string | null> = user
    ? {
        auth_hint: "1",
        auth_role: user.role === "ADMIN" ? "ADMIN" : "USER",
        auth_name: name || null,
      }
    : { auth_hint: null, auth_role: null, auth_name: null };

  // Tulis atau hapus hanya kalau nilainya berubah
  for (const key of COOKIES) {
    const next = values[key];
    const current = req.cookies.get(key)?.value;

    if (next === null) {
      if (current !== undefined) res.cookies.delete(key);
    } else if (current !== next) {
      res.cookies.set(key, next, options);
    }
  }

  return res;
}
