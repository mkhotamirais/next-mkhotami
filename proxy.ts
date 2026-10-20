import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
// import { updateSession as updateSessionSupabase } from "./lib/server/supabase.proxy";
import c from "@/lib/content/shop.json";

const r = c.routes;
const authRoutes = r.authRoutes;
const userRoutes = r.userRoutes;

const adminRoute = r.adminRoute;
const profileRoute = r.profileRoute;
const verifyPendingRoute = r.verifyPendingRoute;
const verifyRoute = r.verifyRoute;

const { auth } = NextAuth({ ...authConfig, session: { strategy: "jwt" } });

const intlMiddleware = createMiddleware(routing);

// Penanda tampilan saja (bukan keamanan): ada/tidaknya cookie session.
function syncAuthHint(req: NextRequest, res: NextResponse) {
  const hasSession = req.cookies.getAll().some((c) => c.name.includes("session-token"));
  const hasHint = req.cookies.has("auth_hint");

  if (hasSession && !hasHint) res.cookies.set("auth_hint", "1", { path: "/", sameSite: "lax" });
  if (!hasSession && hasHint) res.cookies.delete("auth_hint");
  return res;
}

export const proxy = auth(async (req) => {
  const { pathname } = req.nextUrl;

  if (pathname.includes("/api/account/verefy-email")) {
    return NextResponse.next();
  }

  const user = req.auth?.user;
  const isLoggedIn = !!req.auth;
  const role = user?.role;
  const isUser = role === "USER";
  const isAdmin = role === "ADMIN";
  const isVerifiedEmail = !!user?.emailVerified;

  const isAuthRoutes = authRoutes.some((route) => pathname.startsWith(route));
  const isUserRoutes = userRoutes.some((route) => pathname.startsWith(route));

  const isAdminRoute = pathname.startsWith(adminRoute);
  const isProfileRoute = pathname.startsWith(profileRoute);

  // const isVerifyRoute = pathname.startsWith(verifyRoute);
  // const isVerifyPendingRoute = pathname.startsWith(verifyPendingRoute);
  // const isDashbardRoute = pathname.startsWith("/shop/dashboard");

  // if (!isLoggedIn && (isUserRoutes || isAdminRoute || isVerifyRoute || isVerifyPendingRoute)) {
  if (!isLoggedIn && (isUserRoutes || isAdminRoute || isProfileRoute)) {
    return NextResponse.redirect(new URL("/shop/signin", req.url));
  }
  // if (!isLoggedIn && (isUserRoute || isVerifyRoute || isVerifyPendingRoute)) {
  //   return NextResponse.redirect(new URL("/shop/signin", req.url));
  // }

  if (isLoggedIn) {
    if (isAuthRoutes || (isUserRoutes && isAdmin) || (isAdminRoute && isUser)) {
      return NextResponse.redirect(new URL("/shop", req.url));
    }

    // if (isAdminRoute && role !== "ADMIN") {
    //   return NextResponse.redirect(new URL("/user", req.url));
    // }
    // if (isUserRoute && role !== "USER") {
    //   return NextResponse.redirect(new URL("/shop/admin", req.url));
    // }
    // if (isVerifyRoute || isVerifyPendingRoute) {
    //   if (isVerifiedEmail) {
    //     if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    //     if (role === "USER") return NextResponse.redirect(new URL("/user", req.url));
    //   }
    // }
    // if (isTransactionRoutes && !isVerifiedEmail) {
    //   return NextResponse.redirect(new URL("/verify-email-request", req.url));
    // }

    // if (!isVerifiedEmail && isUserRoute && !isBaseUserPage && !isProfileArea) {
    //   return NextResponse.redirect(new URL("/verify-email-request", req.url));
    // }
  }

  const isIntlRoute = routing.locales.some((loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`));
  if (isIntlRoute) {
    const response = intlMiddleware(req);

    // const segments = pathname.split("/");
    // const locale = segments[1];
    // const cleanPath = "/" + segments.slice(2).join("/");

    // const isAdminRoute = cleanPath.startsWith("/admin");
    // const isAuthRoutes = authRoutes.some((route) => cleanPath.startsWith(route));

    // const localizedRedirect = (path: string) => NextResponse.redirect(new URL(`/${locale}${path}`, req.nextUrl));

    // if (!isLogin && isAdminRoute) return localizedRedirect("/login");
    // if (isLogin && isAuthRoutes) return localizedRedirect("/admin");

    return response;
  }

  // await updateSessionSupabase(req);

  // return NextResponse.next();
  return syncAuthHint(req, NextResponse.next());
});

export const config = {
  // matcher: ["/en/:path*", "/id/:path*", "/ar/:path*", "/supabase/:path*", "/shop/:path*"],
  // matcher: ["/", "/(id|en|ar)/:path*"],
  // matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  matcher: [
    /*
     * Jalankan proxy/middleware pada:
     * - Halaman utama (/)
     * - Semua rute multibahasa (cth: /id, /en, /ar, /shop, dll)
     * KECUALI:
     * - api (Public API kamu aman dari middleware)
     * - _next/static, _next/image (file internal Next.js)
     * - _vercel (file deployment Vercel)
     * - File ber-ekstensi seperti favicon.ico, .png, .jpg, dll
     */
    "/((?!api|_next/static|_next/image|_vercel|.*\\..*).*)",
  ],
};
