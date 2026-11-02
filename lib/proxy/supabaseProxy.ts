// lib/proxy/supabase/supabaseProxy.ts
import { NextResponse, type NextRequest } from "next/server";
// import { updateSession as updateSessionSupabase } from "@/lib/server/supabase.proxy";

export function supabaseProxy(req: NextRequest) {
  // nanti: return updateSessionSupabase(req);
  return NextResponse.next();
}
