-- CreateTable
CREATE TABLE "CustomerRenewal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "renewed_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CustomerRenewal_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CustomerRenewal_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CustomerRenewal_renewed_by_fkey" FOREIGN KEY ("renewed_by") REFERENCES "Officer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
