/*
  Warnings:

  - Added the required column `memoryId` to the `Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memoryId` to the `Videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "memoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Videos" ADD COLUMN     "memoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
