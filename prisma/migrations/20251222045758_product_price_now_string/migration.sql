-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "valid_period" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("created_at", "description", "id", "price", "product_name", "updated_at", "valid_period") SELECT "created_at", "description", "id", "price", "product_name", "updated_at", "valid_period" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_product_name_key" ON "Product"("product_name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
