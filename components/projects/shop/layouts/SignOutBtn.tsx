"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/appwrite/useAuth";
import React from "react";

export default function SignOutBtn() {
  const { logout } = useAuth();
  return <Button onClick={logout}>SignOutBtn</Button>;
}
