/*
  Warnings:

  - You are about to drop the column `Otp` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `foodPreference` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `forgotPassword` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `isSinging` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "Otp",
DROP COLUMN "foodPreference",
DROP COLUMN "forgotPassword",
DROP COLUMN "isSinging",
DROP COLUMN "isVerified",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "isOTPVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp" TEXT DEFAULT '',
ALTER COLUMN "isCompleted" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");
