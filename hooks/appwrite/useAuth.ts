import { useState, useEffect } from "react";
import { account } from "@/lib/appwrite";
import { ID } from "appwrite";
// import type { Models } from "appwrite";
import { useRouter } from "next/navigation";
import { AppUser } from "@/lib/types/appwrite";

export function useAuth() {
  const [current, setCurrent] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const register = async (email: string, password: string): Promise<void> => {
    await account.create({
      userId: ID.unique(),
      email,
      password,
    });
    await login(email, password);
  };

  const login = async (email: string, password: string): Promise<void> => {
    await account.createEmailPasswordSession({ email, password });
    const user = await account.get();
    setCurrent(user);
    router.push("/appwrite");
  };

  const logout = async (): Promise<void> => {
    await account.deleteSession({
      sessionId: "current",
    });
    setCurrent(null);
    router.push("/appwrite");
  };

  //   const getCurrentUser = async () => {
  //     try {
  //       const user = await account.get();
  //       setCurrent(user);
  //     } catch (error) {
  //       console.log(error);
  //       setCurrent(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await account.get();
        setCurrent(user);
      } catch (error) {
        console.log(error);
        setCurrent(null);
      } finally {
        setLoading(false);
      }
    };
    getCurrentUser();
  }, []);

  //   useEffect(() => {
  //     const getCurrentUser = async () => {
  //       try {
  //         const user = await account.get();
  //         setCurrent(user);
  //       } catch (error) {
  //         console.log(error);
  //         setCurrent(null);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     getCurrentUser();
  //   }, []);

  return {
    current,
    loading,
    login,
    logout,
    register,
  };
}
