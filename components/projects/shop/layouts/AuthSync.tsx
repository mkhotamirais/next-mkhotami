"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const initialsOf = (text: string) =>
  text
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => Array.from(w)[0])
    .join("")
    .toUpperCase();

export function AuthSync() {
  const { data: session, status } = useSession();
  console.log("halo");

  useEffect(() => {
    if (status === "loading") return;

    const root = document.documentElement;
    const set = (name: string, value: string | null) =>
      value ? root.style.setProperty(name, value) : root.style.removeProperty(name);

    const user = session?.user;
    // console.log("user", user);
    // console.log("halo");

    if (status === "authenticated" && user) {
      const label = user.name || user.email || "";
      const role = user.role === "ADMIN" ? "ADMIN" : "USER";

      set("--auth-name", label ? JSON.stringify(label) : null);
      set("--auth-initials", label ? JSON.stringify(initialsOf(label)) : null);
      // Foto hanya diperbarui kalau ada, tidak dihapus di sini, supaya tidak berkedip
      if (user.image) set("--auth-image", `url(${JSON.stringify(user.image)})`);

      if (root.dataset.role !== role) root.dataset.role = role;
    } else {
      set("--auth-name", null);
      set("--auth-initials", null);
      set("--auth-image", null);
      if (root.dataset.role !== "guest") root.dataset.role = "guest";
    }
  }, [session, status]);

  return null;
}
