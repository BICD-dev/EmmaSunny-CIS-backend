/*
  Warnings:

  - Added the required column `first_mame` to the `Officer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Officer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Officer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_mame" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Officer" ("email", "id", "password", "phone", "role", "username") SELECT "email", "id", "password", "phone", "role", "username" FROM "Officer";
DROP TABLE "Officer";
ALTER TABLE "new_Officer" RENAME TO "Officer";
CREATE UNIQUE INDEX "Officer_username_key" ON "Officer"("username");
CREATE UNIQUE INDEX "Officer_email_key" ON "Officer"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
