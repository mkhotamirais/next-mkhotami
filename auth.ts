import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import authConfig from "./auth.config";
// import { compareSync } from "bcrypt-ts"; // kalau diaktifkan lagi, import-nya hanya di file ini

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;
        const normalizedEmail = email.toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          include: { accounts: true },
        });
        if (!user) return null;

        // ...logika password kamu (yang sekarang di-comment) tetap di sini

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.phone = user.phone;
        token.emailVerified = user.emailVerified;
        token.pendingEmail = user.pendingEmail;
        return token;
      }

      if (trigger === "update" || !token.id) {
        const latestUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (latestUser) {
          token.id = latestUser.id;
          token.name = latestUser.name;
          token.email = latestUser.email;
          token.emailVerified = latestUser.emailVerified;
        }
      }

      return token;
    },
    async session({ session, token }) {
      const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
      session.user.id = dbUser?.id as string;
      session.user.name = dbUser?.name;
      session.user.email = dbUser?.email as string;
      session.user.emailVerified = dbUser?.emailVerified as Date | null;
      return session;
    },
  },
});

// import { PrismaAdapter } from "@auth/prisma-adapter";
// import NextAuth from "next-auth";
// import prisma from "@/lib/prisma";
// import authConfig from "./auth.config";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "jwt" },
//   ...authConfig,
// });
