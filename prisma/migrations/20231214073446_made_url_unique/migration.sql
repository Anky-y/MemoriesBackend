/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Images` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Videos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Images_url_key" ON "Images"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Videos_url_key" ON "Videos"("url");
