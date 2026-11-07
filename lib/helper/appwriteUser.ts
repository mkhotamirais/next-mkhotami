import { Models } from "appwrite";

const KEY = "aw_user";

// Data tampilan saja (bukan keamanan). Dibaca script di <head> sebelum cat pertama.
export function appwriteUser(user: Models.User | null) {
  try {
    if (!user) {
      localStorage.removeItem(KEY);
      return;
    }

    const raw = user.prefs?.image;
    const image = typeof raw === "string" && raw.startsWith("https://") ? raw : null;

    localStorage.setItem(
      KEY,
      JSON.stringify({
        name: (user.name || user.email || "").slice(0, 60),
        role: user.labels?.includes("admin") ? "ADMIN" : "USER",
        image,
      }),
    );
  } catch {}
}
