/*
  Warnings:

  - Added the required column `userId` to the `Memories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Memories" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Memories" ADD CONSTRAINT "Memories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
