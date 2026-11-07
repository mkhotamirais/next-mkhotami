"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/appwrite/useAuth";
import React from "react";

export default function SignoutButton() {
  const { current, logout } = useAuth();
  const isLoggedIn = !!current;

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      {current?.email}
      <Button onClick={logout}>SignoutButton</Button>;
    </div>
  );
}
