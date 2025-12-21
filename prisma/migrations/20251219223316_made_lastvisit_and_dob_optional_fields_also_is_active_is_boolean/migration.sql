/*
  Warnings:

  - You are about to alter the column `DateOfBirth` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.
  - You are about to alter the column `is_active` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "last_visit" DATETIME,
    "gender" TEXT NOT NULL,
    "DateOfBirth" DATETIME,
    "customer_code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "profile_image" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "officer_id" TEXT NOT NULL,
    CONSTRAINT "Customer_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Customer_officer_id_fkey" FOREIGN KEY ("officer_id") REFERENCES "Officer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Customer" ("DateOfBirth", "created_at", "customer_code", "email", "first_name", "gender", "id", "is_active", "last_name", "last_visit", "officer_id", "phone", "product_id", "profile_image", "updated_at") SELECT "DateOfBirth", "created_at", "customer_code", "email", "first_name", "gender", "id", "is_active", "last_name", "last_visit", "officer_id", "phone", "product_id", "profile_image", "updated_at" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE INDEX "Customer_id_idx" ON "Customer"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
