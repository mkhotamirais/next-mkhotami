import { account, avatars } from "../appwrite";
import { User } from "../types/appwrite";

// ambil foto dari provider, simpan ke prefs
export const getAvatarUrl = async (user: User): Promise<string> => {
  // 1. kalau sudah pernah disimpan, pakai itu
  if (user.prefs?.avatar) return user.prefs.avatar;

  try {
    const session = await account.getSession({ sessionId: "current" });
    let url: string | null = null;

    if (session.provider === "google") {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${session.providerAccessToken}` },
      });
      url = (await res.json()).picture ?? null;
    } else if (session.provider === "github") {
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${session.providerAccessToken}` },
      });
      url = (await res.json()).avatar_url ?? null;
    }

    if (url) {
      await account.updatePrefs({ prefs: { ...user.prefs, avatar: url } });
      return url;
    }
  } catch {
    // sesi email/password tidak punya provider token, atau token ditolak
  }

  // 2. fallback: avatar inisial dari Appwrite
  return avatars.getInitials({ name: user.name }).toString();
};
