"use client";

import { useAuth } from "@/hooks/appwrite/useAuth";
import React from "react";

export default function SignOutBtn() {
  const { logout } = useAuth();
  return (
    <div>
      <button className="button" type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
