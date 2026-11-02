import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import c from "@/lib/content/shop.json";
import { inPath } from "@/lib/utils";
import { shopSyncAuth } from "./shopSyncAuth";

const r = c.routes;
const authRoutes = r.authRoutes;
const userRoutes = r.userRoutes;
const adminRoute = r.adminRoute;
const profileRoute = r.profileRoute;

// Instance Auth.js khusus untuk proxy /shop
const { auth } = NextAuth({ ...authConfig, session: { strategy: "jwt" } });

const handler = auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.includes("/api/account/verefy-email")) {
    return NextResponse.next();
  }

  const user = req.auth?.user;
  const isLoggedIn = !!req.auth;
  const role = user?.role;
  const isUser = role === "USER";
  const isAdmin = role === "ADMIN";

  // Semua return di bawah lewat finish(), jadi hint selalu ikut tersinkron.
  // Request API dilewati: hint cukup diperbarui di request halaman.
  const isApi = inPath(pathname, "/shop/api");
  const finish = (res: NextResponse) => (isApi ? res : shopSyncAuth(req, res, isLoggedIn ? user : undefined));

  const isAuthRoutes = authRoutes.some((route) => pathname.startsWith(route));
  const isUserRoutes = userRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = pathname.startsWith(adminRoute);
  const isProfileRoute = pathname.startsWith(profileRoute);

  // Belum login tapi membuka halaman yang dilindungi
  if (!isLoggedIn && (isUserRoutes || isAdminRoute || isProfileRoute)) {
    return finish(NextResponse.redirect(new URL("/shop/signin", req.url)));
  }

  // Sudah login tapi membuka halaman yang tidak sesuai
  if (isLoggedIn) {
    if (isAuthRoutes || (isUserRoutes && isAdmin) || (isAdminRoute && isUser)) {
      return finish(NextResponse.redirect(new URL("/shop", req.url)));
    }
  }

  // Titik sinkron setelah login: proxy menulis cookie hint, lalu mengalihkan ke tujuan akhir
  if (pathname === "/shop/redirect") {
    const target = isLoggedIn && isAdmin ? "/shop/dashboard" : "/shop";
    return finish(NextResponse.redirect(new URL(target, req.url)));
  }

  return finish(NextResponse.next());
});

// Auth.js mengetik wrapper ini seperti route handler (argumen kedua berisi params),
// padahal Next.js memanggil proxy dengan NextFetchEvent. Beri tipe yang sesuai.
type ProxyHandler = (req: NextRequest, event: NextFetchEvent) => Promise<Response | undefined | void>;

export const shopProxy = handler as unknown as ProxyHandler;
