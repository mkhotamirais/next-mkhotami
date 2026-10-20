"use client";

import { SessionProvider } from "next-auth/react";
import { AuthSync } from "./AuthSync";

export function NextAuthProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/shop/api/auth">
      <AuthSync />
      {children}
    </SessionProvider>
  );
}
