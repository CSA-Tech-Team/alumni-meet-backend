/*
  Warnings:

  - A unique constraint covering the columns `[eventName]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Activity_eventName_key" ON "Activity"("eventName");
