import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { shopProxy } from "@/lib/proxy/shopProxy";
import { appwriteProxy } from "@/lib/proxy/appwriteProxy";
import { supabaseProxy } from "@/lib/proxy/supabaseProxy";
import { inPath } from "./lib/utils";

const intlMiddleware = createMiddleware(routing);

export function proxy(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  if (inPath(pathname, "/shop")) return shopProxy(req, event);
  if (inPath(pathname, "/appwrite")) return appwriteProxy(req);
  if (inPath(pathname, "/supabase")) return supabaseProxy(req);

  const isIntlRoute = routing.locales.some((loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`));
  if (isIntlRoute) return intlMiddleware(req);

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_vercel|.*\\..*).*)"],
};
