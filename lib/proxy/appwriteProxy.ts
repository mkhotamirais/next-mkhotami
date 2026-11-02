// lib/proxy/appwrite/appwriteProxy.ts
import { NextResponse, type NextRequest } from "next/server";
// import { appwriteSyncAuth } from "./appwriteSyncAuth";

export function appwriteProxy(req: NextRequest) {
  // nanti: baca session Appwrite, lalu return appwriteSyncAuth(req, res, user)
  return NextResponse.next();
}
