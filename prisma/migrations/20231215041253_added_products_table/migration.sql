/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `Memories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Memories" DROP COLUMN "date_of_birth";

-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_name_key" ON "Products"("name");
