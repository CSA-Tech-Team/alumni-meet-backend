/*
  Warnings:

  - You are about to drop the `Singing` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Events" AS ENUM ('Singing', 'Dancing', 'Musical_Chair', 'Memories_Sharing');

-- DropForeignKey
ALTER TABLE "Singing" DROP CONSTRAINT "Singing_userId_fkey";

-- DropTable
DROP TABLE "Singing";

-- CreateTable
CREATE TABLE "ActivityDetails" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "songDetails" TEXT,
    "topic" TEXT,
    "needKaroke" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ActivityDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivityDetails" ADD CONSTRAINT "ActivityDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
