/*
  Warnings:

  - A unique constraint covering the columns `[users]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_users_key" ON "Category"("users");
