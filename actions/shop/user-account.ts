"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { compare, hash } from "bcrypt-ts";
import { Address, Prisma } from "@/lib/generated/prisma/client";
import { addressSchema, changePasswordSchema, deleteAccountSchema, profileDataSchema } from "@/lib/schemas/user";
import { sendEmailChangeVerification } from "./user-auth";

type ProfileUpdateData = z.infer<typeof profileDataSchema>;

const normalizeValue = (value: string | null | undefined): string | null | undefined => {
  if (typeof value === "string" && value.trim() === "") return null;
  return value;
};

// ---------- PROFILE ----------
// PUT /api/account/profile
export async function updateProfileData(data: ProfileUpdateData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return { error: "Unauthorized" };

  const userId = session.user.id;
  const validatedFields = profileDataSchema.safeParse(data);

  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error).properties };
  }

  const { name, email: newEmail, phone: inputPhone } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found" };

    const updates: Prisma.UserUpdateInput = {};
    let emailChangePending = false;

    const normalizedInputPhone = normalizeValue(inputPhone);
    const normalizedUserPhone = normalizeValue(user.phone);

    if (name !== user.name) {
      updates.name = name;
    }

    if (normalizedInputPhone !== normalizedUserPhone) {
      if (normalizedInputPhone !== null) {
        const duplicatePhoneNumber = await prisma.user.findFirst({
          where: { phone: normalizedInputPhone, id: { not: userId } },
        });

        if (duplicatePhoneNumber) return { error: "Phone number is already in use" };
      }

      updates.phone = normalizedInputPhone;
    }

    if (newEmail && newEmail !== user.email) {
      const existingUserWithEmail = await prisma.user.findFirst({
        where: { OR: [{ email: newEmail }, { pendingEmail: newEmail }] },
      });

      if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
        return { error: "Email is already in use or pending verification" };
      }

      await prisma.user.update({
        where: { id: userId },
        data: { pendingEmail: newEmail, emailVerified: null },
      });

      emailChangePending = true;

      await sendEmailChangeVerification(newEmail, userId);
    }

    if (Object.keys(updates).length > 0) {
      await prisma.user.update({ where: { id: userId }, data: updates });
    }

    revalidatePath("/account/profile");

    if (emailChangePending) {
      return { message: "Verification email sent to new address. Please check your inbox." };
    }

    return { message: "Account updated successfully" };
  } catch (error) {
    console.error("Server Action updateProfileData error:", error);
    return { error: "Internal Server Error" };
  }
}

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

// PATCH /api/account/profile
export async function profileChangePassword(data: ChangePasswordData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;
  const validatedFields = changePasswordSchema.safeParse(data);

  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error).properties };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { password: true } });

    if (!user || !user.password) return { error: "User tidak ditemukan atau password tidak diatur" };

    const isPasswordValid = await compare(currentPassword, user.password);

    if (!isPasswordValid) return { error: "Password lama salah" };

    const newHashedPassword = await hash(newPassword, 10);

    await prisma.user.update({ where: { id: userId }, data: { password: newHashedPassword } });

    return { message: "Password berhasil diubah" };
  } catch (error) {
    console.error("Server Action profileChangePassword error:", error);
    return { error: "Internal Server Error" };
  }
}

// DELETE /api/account/profile
export async function profileDeleteAccount(data: { text: string }) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;
  const validatedFields = deleteAccountSchema.safeParse(data);

  if (!validatedFields.success) return { errors: z.treeifyError(validatedFields.error).properties };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { Cart: { userId: userId } } });
      await tx.orderItem.deleteMany({ where: { Order: { userId: userId } } });
      await tx.blog.deleteMany({ where: { userId: userId } });
      await tx.product.deleteMany({ where: { userId: userId } });
      await tx.cart.deleteMany({ where: { userId: userId } });
      await tx.order.deleteMany({ where: { userId: userId } });
      await tx.account.deleteMany({ where: { userId: userId } });
      await tx.passwordResetToken.deleteMany({ where: { userId: userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    return { message: "Akun dan semua data terkait berhasil dihapus secara permanen." };
  } catch (error) {
    console.error("Server Action profileDeleteAccount error:", error);

    return { error: "Terjadi kesalahan server saat memproses penghapusan akun. Beberapa data mungkin gagal dihapus." };
  }
}

interface GetAddressesParams {
  limit?: number;
  page?: number;
}

// ---------- ADDRESS ----------
// GET /api/account/address
export const getAddresses = async ({ limit = 8, page = 1 }: GetAddressesParams) => {
  const session = await auth();
  const userId = session?.user?.id as string;

  const skip = (page - 1) * limit;
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    take: limit,
    skip: skip,
  });
  const totalAddressCount = await prisma.address.count({ where: { userId } });
  const totalPages = Math.ceil(totalAddressCount / limit);

  return { addresses, totalPages, totalAddressCount };
};

// GET /api/account/address/:id
export const getAddressById = async (id: string): Promise<Address | null> => {
  try {
    const session = await auth();
    const userId = session?.user?.id as string;
    const address = await prisma.address.findFirst({
      where: { userId, id },
      orderBy: { updatedAt: "desc" },
    });
    return address;
  } catch (error) {
    console.log(error);
    return null;
  }
};

type CreateAddressData = z.infer<typeof addressSchema>;

// POST /api/account/address
export async function createAddress(data: CreateAddressData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;
  const isDefault = data.isDefault === false ? false : true;
  const validatedFields = addressSchema.safeParse({ ...data });

  if (!validatedFields.success) return { errors: z.treeifyError(validatedFields.error) };

  const { ...addressData } = validatedFields.data;
  const cleanData = { ...addressData, label: addressData.label || "Alamat Baru" };

  try {
    const newAddress = await prisma.$transaction(async (tx) => {
      const addressCount = await tx.address.count({ where: { userId } });
      const isFirstAddress = addressCount === 0;
      const newIsDefault = isFirstAddress || isDefault;

      if (newIsDefault && !isFirstAddress) {
        await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
      }

      return await tx.address.create({ data: { ...cleanData, userId, isDefault: newIsDefault } });
    });

    revalidatePath("/dashboard/account/address");
    return { message: "Alamat baru berhasil ditambahkan.", address: newAddress };
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") return { error: "Label alamat sudah digunakan." };
    }
    return { error: "Terjadi kesalahan server saat menyimpan alamat." };
  }
}

type UpdateAddressData = z.infer<typeof addressSchema>;

// PUT /api/account/address/:id
export async function updateAddress(id: string, data: UpdateAddressData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;
  const isDefault = data.isDefault === false ? false : true;
  const validatedFields = addressSchema.safeParse(data);

  if (!validatedFields.success) return { errors: z.treeifyError(validatedFields.error).properties };

  const { ...updateData } = validatedFields.data;

  try {
    const updatedAddress = await prisma.$transaction(async (tx) => {
      const existingAddress = await tx.address.findFirst({
        where: { userId, id },
        select: { id: true, isDefault: true },
      });

      if (!existingAddress) throw new Error("NOT_FOUND");

      if (isDefault && !existingAddress.isDefault) {
        await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
      }

      return await tx.address.update({ where: { id: existingAddress.id }, data: { ...updateData, isDefault } });
    });

    revalidatePath("/dashboard/account/address");
    return { message: "Alamat berhasil diperbarui.", address: updatedAddress };
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return { error: "Alamat tidak ditemukan." };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Label alamat sudah digunakan." };
    }
    return { error: "Terjadi kesalahan server saat memperbarui alamat." };
  }
}

// DELETE /api/account/address/:id
export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      const addressToDelete = await tx.address.findFirst({ where: { userId, id } });
      if (!addressToDelete) throw new Error("NOT_FOUND");

      await tx.address.delete({ where: { id: addressToDelete.id } });

      if (addressToDelete.isDefault) {
        const remainingAddress = await tx.address.findFirst({ where: { userId }, orderBy: { createdAt: "asc" } });
        if (remainingAddress) {
          await tx.address.update({ where: { id: remainingAddress.id }, data: { isDefault: true } });
        }
      }
    });

    revalidatePath("/dashboard/account/address");
    return { message: "Alamat berhasil dihapus." };
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return { error: "Alamat tidak ditemukan." };
    }
    return { error: "Terjadi kesalahan server saat menghapus alamat." };
  }
}
