import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
// import {
//   // adminRoute,
//   authRoutes,
//   transactionRoutes,
//   userRoute,
//   verifyPendingRoute,
//   verifyRoute,
// } from "./lib/content/shop/menu";
// import { updateSession as updateSessionSupabase } from "./lib/server/supabase.proxy";

const intlMiddleware = createMiddleware(routing);

export const proxy = auth(async (req) => {
  const { pathname } = req.nextUrl;

  if (pathname.includes("/api/account/verefy-email")) {
    return NextResponse.next();
  }

  const user = req.auth?.user;
  const isLoggedIn = !!req.auth;
  //   const role = user?.role;
  //   const isVerifiedEmail = !!user?.emailVerified;

  //   const isAuthRoutes = authRoutes.some((route) => pathname.startsWith(route));
  //   const isTransactionRoutes = transactionRoutes.some((route) => pathname.startsWith(route));
  //   const isUserRoute = pathname.startsWith(userRoute);
  const isBaseUserPage = pathname === "/user";
  const isProfileArea = pathname.startsWith("/user/profile");
  //   const isVerifyRoute = pathname.startsWith(verifyRoute);
  //   const isVerifyPendingRoute = pathname.startsWith(verifyPendingRoute);
  // const isDashbardRoute = pathname.startsWith("/shop/dashboard");

  // if (!isLoggedIn && (isUserRoute || isAdminRoute || isVerifyRoute || isVerifyPendingRoute)) {
  //   return NextResponse.redirect(new URL("/shop/signin", req.url));
  // }
  //   if (!isLoggedIn && (isUserRoute || isVerifyRoute || isVerifyPendingRoute)) {
  //     return NextResponse.redirect(new URL("/shop/signin", req.url));
  //   }

  //   if (isLoggedIn) {
  //     if (isAuthRoutes) {
  //       return NextResponse.redirect(new URL("/shop/dashboard", req.url));
  //     }
  //     // if (isAdminRoute && role !== "ADMIN") {
  //     //   return NextResponse.redirect(new URL("/user", req.url));
  //     // }
  //     if (isUserRoute && role !== "USER") {
  //       return NextResponse.redirect(new URL("/admin", req.url));
  //     }
  //     if (isVerifyRoute || isVerifyPendingRoute) {
  //       if (isVerifiedEmail) {
  //         if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
  //         if (role === "USER") return NextResponse.redirect(new URL("/user", req.url));
  //       }
  //     }
  //     if (isTransactionRoutes && !isVerifiedEmail) {
  //       return NextResponse.redirect(new URL("/verify-email-request", req.url));
  //     }

  //     if (!isVerifiedEmail && isUserRoute && !isBaseUserPage && !isProfileArea) {
  //       return NextResponse.redirect(new URL("/verify-email-request", req.url));
  //     }
  //   }

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

  return NextResponse.next();
});

export const config = {
  matcher: ["/en/:path*", "/id/:path*", "/ar/:path*", "/supabase/:path*", "/shop/:path*"],
};
