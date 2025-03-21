/*
  Warnings:

  - Added the required column `event` to the `ActivityDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `ActivityDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityDetails" ADD COLUMN     "event" "Events" NOT NULL,
ADD COLUMN     "eventId" TEXT NOT NULL;
