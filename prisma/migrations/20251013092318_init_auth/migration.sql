/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kycId" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpires" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "fullName" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'EMPLOYEE';
