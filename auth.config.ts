// auth.config.ts
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import { compareSync } from "bcrypt-ts";
import prisma from "./lib/prisma";

class CustomAuthError extends CredentialsSignin {
  constructor(message: string) {
    super();
    this.code = message;
  }
}

export default {
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const email = (credentials?.email as string | undefined)?.toLowerCase().trim();
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { accounts: { select: { provider: true }, take: 1 } },
        });
        if (!user) return null;

        // Akun dibuat lewat OAuth dan belum punya password
        if (!user.password) {
          const provider = user.accounts[0]?.provider ?? "social login";
          throw new CustomAuthError(`You have an account with ${provider}. Please sign in with ${provider}`);
        }

        if (!compareSync(password, user.password)) return null;

        // Jangan kembalikan hash password ke bagian lain Auth.js
        const { password: _password, accounts: _accounts, ...safeUser } = user;
        return safeUser;
      },
    }),
  ],
  pages: { signIn: "/shop/signin" },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Saat login: isi token dari user
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

      // Saat session.update() dipanggil: segarkan dari database
      if (trigger === "update" && token.id) {
        const latest = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            name: true,
            email: true,
            role: true,
            phone: true,
            emailVerified: true,
            pendingEmail: true,
          },
        });
        if (latest) {
          token.name = latest.name;
          token.email = latest.email;
          token.role = latest.role;
          token.phone = latest.phone;
          token.emailVerified = latest.emailVerified;
          token.pendingEmail = latest.pendingEmail;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = (token.name as string | null) ?? null;
      session.user.email = token.email as string;
      session.user.role = token.role;
      session.user.phone = token.phone;
      session.user.pendingEmail = token.pendingEmail;
      session.user.emailVerified = token.emailVerified ? new Date(token.emailVerified as unknown as string) : null;
      return session;
    },
  },
} satisfies NextAuthConfig;
