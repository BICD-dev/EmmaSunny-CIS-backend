-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Officer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active'
);
INSERT INTO "new_Officer" ("created_at", "email", "first_name", "id", "last_name", "password", "phone", "role", "updated_at", "username") SELECT "created_at", "email", "first_name", "id", "last_name", "password", "phone", "role", "updated_at", "username" FROM "Officer";
DROP TABLE "Officer";
ALTER TABLE "new_Officer" RENAME TO "Officer";
CREATE UNIQUE INDEX "Officer_username_key" ON "Officer"("username");
CREATE UNIQUE INDEX "Officer_email_key" ON "Officer"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
