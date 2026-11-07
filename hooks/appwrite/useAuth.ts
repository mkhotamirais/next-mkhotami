// hooks/appwrite/useAuth.ts
import { useState, useEffect } from "react";
import { account } from "../../lib/appwrite";
import { ID, OAuthProvider } from "appwrite";
import { useRouter } from "next/navigation";
import { User, UserPrefs } from "@/lib/types/appwrite";
import { getAvatarUrl } from "@/lib/helper/appwrite-helper";

// di luar hook: murni mengambil data, tidak memanggil setState
const fetchUserWithAvatar = async () => {
  const user = await account.get<UserPrefs>();
  const avatar = await getAvatarUrl(user);
  return { user, avatar };
};

export function useAuth() {
  const [current, setCurrent] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = async (email: string, password: string): Promise<void> => {
    await account.createEmailPasswordSession({ email, password });
    const { user, avatar } = await fetchUserWithAvatar();
    setCurrent(user);
    setAvatarUrl(avatar);
    router.push("/");
  };

  const register = async (email: string, password: string): Promise<void> => {
    await account.create({ userId: ID.unique(), email, password });
    await login(email, password);
  };

  const loginWithOAuth = (provider: OAuthProvider) => {
    account.createOAuth2Session({
      provider,
      success: `${window.location.origin}/appwrite`,
      failure: `${window.location.origin}/appwrite/login`,
    });
  };

  const logout = async (): Promise<void> => {
    await account.deleteSession({ sessionId: "current" });
    setCurrent(null);
    setAvatarUrl(null);
    router.push("/");
  };

  useEffect(() => {
    let cancelled = false;

    fetchUserWithAvatar()
      .then(({ user, avatar }) => {
        if (cancelled) return;
        setCurrent(user);
        setAvatarUrl(avatar);
      })
      .catch(() => {
        // belum login: state sudah null dari awal, tidak perlu diubah
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { current, avatarUrl, loading, login, loginWithOAuth, logout, register };
}
