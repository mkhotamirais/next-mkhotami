"use client";

import { useSession } from "next-auth/react";
import React from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const user = session.data?.user;
  const name = user?.name;
  return (
    <div className="container my-4">
      ProtectedLayout {name}
      {children}
    </div>
  );
}
