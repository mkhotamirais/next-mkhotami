/*
  Warnings:

  - A unique constraint covering the columns `[emailChangeVerificationToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pendingEmail]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailChangeVerificationToken" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "pendingEmail" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "users_emailChangeVerificationToken_key" ON "users"("emailChangeVerificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_pendingEmail_key" ON "users"("pendingEmail");
