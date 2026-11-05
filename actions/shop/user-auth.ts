"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { hash } from "bcrypt-ts";
import { hashSync } from "bcrypt-ts";
import { Resend } from "resend";
import crypto from "crypto";
import { resetPasswordSchema, signupSchema } from "@/lib/schemas/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailVerification(email: string, userId?: string, callbackUrl?: string) {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 3600 * 1000);

    // 1. Hapus token lama dan buat yang baru
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({ data: { identifier: email, token: token, expires: expires } });

    // 2. Buat URL Verifikasi menggunakan NEXTAUTH_URL
    const baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) {
      throw new Error("NEXTAUTH_URL not set in environment.");
    }
    const finalRedirect = callbackUrl || "/user";
    const separator = finalRedirect.includes("?") ? "&" : "?";

    const callbackWithQuery = `${finalRedirect}${separator}verify-email=new-email`;

    const verificationUrl = `${baseUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackWithQuery)}`;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userName = user?.name || "Pengguna";

    // 3. Kirim Email melalui Resend
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@warungota.com",
      to: email,
      subject: "Verifikasi Alamat Email Anda",
      html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2>Verifikasi Email Akun Anda</h2>
                    <p>Halo ${userName},</p>
                    <p>Terima kasih telah mendaftar. Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda:</p>
                    <a 
                        href="${verificationUrl}" 
                        style="display: inline-block; padding: 10px 20px; margin: 15px 0; background-color: #1d4ed8; color: white; text-decoration: none; border-radius: 5px;"
                        target="_blank"
                    >
                        Verifikasi Email
                    </a>
                    <p style="font-size: 12px; color: #777;">Tautan ini akan kedaluwarsa dalam 24 jam.</p>
                </div>
            `,
    });

    if (result.error) {
      console.error("Resend Error:", result.error);
      throw new Error(`Failed to send email: ${result.error.message}`);
    }
  } catch (error) {
    console.error("Email verification send process error:", error);
    throw new Error("Failed to send verification email. Please try again.");
  }
}

export async function sendEmailChangeVerification(newEmail: string, userId: string, callbackUrl?: string) {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const baseUrl = process.env.NEXTAUTH_URL;

    if (!baseUrl) {
      throw new Error("NEXTAUTH_URL not set in environment.");
    }

    await prisma.user.update({ where: { id: userId }, data: { emailChangeVerificationToken: token } });

    const finalRedirect = callbackUrl || "/user";
    const separator = finalRedirect.includes("?") ? "&" : "?";

    const callbackWithQuery = `${finalRedirect}${separator}verify-email=update-email`;

    const verificationUrl = `${baseUrl}/verify-email-change?token=${token}&userId=${userId}&callbackUrl=${encodeURIComponent(callbackWithQuery)}`;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userName = user?.name || "Pengguna";

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "test@example.com",
      to: newEmail,
      subject: "Konfirmasi Perubahan Alamat Email Anda",
      html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2>Konfirmasi Email Baru Akun Anda</h2>
                    <p>Halo ${userName},</p>
                    <p>Anda telah meminta perubahan alamat email. Silakan klik tombol di bawah ini untuk mengkonfirmasi alamat email baru Anda (${newEmail}):</p>
                    <a 
                        href="${verificationUrl}" 
                        style="display: inline-block; padding: 10px 20px; margin: 15px 0; background-color: #1d4ed8; color: white; text-decoration: none; border-radius: 5px;"
                        target="_blank"
                    >
                        Konfirmasi Email Baru
                    </a>
                    <p style="font-size: 12px; color: #777;">Jika Anda tidak meminta perubahan ini, abaikan email ini.</p>
                </div>
            `,
    });

    if (result.error) {
      console.error("Resend Error:", result.error);
      throw new Error(`Failed to send email: ${result.error.message}`);
    }
  } catch (error) {
    console.error("Email change verification send process error:", error);
    throw new Error("Failed to send verification email for change. Please try again.");
  }
}

export async function signup(data: z.infer<typeof signupSchema>) {
  const validatedFields = signupSchema.safeParse(data);
  if (!validatedFields.success) return { errors: z.treeifyError(validatedFields.error).properties };

  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) return { error: `Email '${email}' sudah terdaftar.` };

    const hashedPassword = hashSync(password, 10);

    const user = await prisma.user.create({ data: { name, email, password: hashedPassword, emailVerified: null } });

    await sendEmailVerification(email, user.id);

    return { message: "Pendaftaran berhasil. Silakan cek email Anda untuk verifikasi." };
  } catch (error) {
    console.log(error);
    return { error: "Terjadi kesalahan server saat melakukan pendaftaran." };
  }
}

// ---------- PASSWORD RESET ----------
const generateToken = () => {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    expires: new Date(Date.now() + 3600 * 1000),
  };
};

export async function resetPasswordRequest(data: { email: string }) {
  const { email } = data;
  if (!email) return { error: "Email required" };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: "Email salah atau belum terdaftar." };

    const { token, expires } = generateToken();
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${email}`;

    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: { token, expires },
      create: { userId: user.id, token, expires },
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Reset Password Warungota",
      html: `<p>Anda meminta reset password. Klik tautan berikut dalam 1 jam:</p><p><a href="${resetLink}">Reset Password</a></p>`,
    });

    return { message: "Jika email terdaftar, tautan reset telah dikirim." };
  } catch (error) {
    console.log(error);
    return { error: "Internal server error." };
  }
}

const SALT_ROUNDS = 10;

export async function resetPassword(
  token: string | null,
  email: string | null,
  newPassword: string,
  confirmNewPassword: string,
) {
  try {
    if (!token || !email) return { error: "Token, email harus ada." };

    const resetToken = await prisma.passwordResetToken.findFirst({ where: { token: token, User: { email: email } } });
    if (!resetToken) return { error: "Tautan reset tidak valid atau sudah digunakan." };

    if (resetToken.expires < new Date()) return { error: "Tautan reset sudah kedaluwarsa." };

    const validatedFields = resetPasswordSchema.safeParse({ newPassword, confirmNewPassword });
    if (!validatedFields.success) return { errors: z.treeifyError(validatedFields.error).properties };

    const hashedPassword = await hash(newPassword, SALT_ROUNDS);

    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashedPassword } }),
      prisma.passwordResetToken.delete({ where: { id: resetToken.id } }),
    ]);

    return { message: "Password berhasil direset! Anda akan dialihkan ke halaman login." };
  } catch (error) {
    console.log(error);
    return { error: "Terjadi kesalahan server saat mereset password." };
  }
}

export async function verifyEmailRequest(callbackUrl?: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) return { error: "Unauthorized" };

  const userEmail = session.user.email;
  const targetUrl = callbackUrl || "/user";

  try {
    if (session.user.pendingEmail) {
      await sendEmailChangeVerification(session.user.pendingEmail, session.user.id, targetUrl);
    } else {
      await sendEmailVerification(userEmail, session.user.id, targetUrl);
    }

    return { message: "Email berhasil diverifikasi. Silakan cek email Anda." };
  } catch (error) {
    console.log(error);
    return { error: "Terjadi kesalahan server saat memverifikasi email." };
  }
}

export async function verifyEmail({ token, email }: { token: string; email: string }) {
  try {
    const normalizedEmail = email.toLowerCase();

    const verificationToken = await prisma.verificationToken.findFirst({
      where: { identifier: normalizedEmail, token },
    });

    if (!verificationToken) {
      const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (user?.emailVerified) return { success: true, message: "Email already verified" };
      return { error: "Token not found or invalid" };
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail, token } });
      return { error: "Token has expired" };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email: normalizedEmail },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.deleteMany({
        where: { identifier: normalizedEmail, token },
      }),
    ]);

    revalidatePath("/dashboard");
    return { success: true, message: "Email successfully verified" };
  } catch (error) {
    console.error("Verification error:", error);
    return { error: "Internal Server Error" };
  }
}

export async function verifyEmailChange({ token, userId }: { token: string; userId: string }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId, emailChangeVerificationToken: token },
      select: { pendingEmail: true },
    });

    if (!user) return { error: "Token not found or invalid" };
    if (!user.pendingEmail) return { error: "No pending email found" };

    await prisma.user.update({
      where: { id: userId },
      data: {
        email: user.pendingEmail,
        emailVerified: new Date(),
        pendingEmail: null,
        emailChangeVerificationToken: null,
      },
    });

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Email successfully updated" };
  } catch (error) {
    console.error("Email change error:", error);
    return { error: "Internal Server Error" };
  }
}
