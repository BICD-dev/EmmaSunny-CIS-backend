/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Officer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Officer_username_key" ON "Officer"("username");
