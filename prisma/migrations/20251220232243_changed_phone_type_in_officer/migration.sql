-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Officer" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
