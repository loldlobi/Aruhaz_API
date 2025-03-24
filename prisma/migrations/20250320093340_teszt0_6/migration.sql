/*
  Warnings:

  - Added the required column `cim` to the `Termekek` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `termekek` ADD COLUMN `cim` VARCHAR(191) NOT NULL;
