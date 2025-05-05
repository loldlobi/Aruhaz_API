/*
  Warnings:

  - Made the column `kep` on table `termekek` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `termekek` MODIFY `kep` VARCHAR(191) NOT NULL;
