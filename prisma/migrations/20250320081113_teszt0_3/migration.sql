/*
  Warnings:

  - Added the required column `ar` to the `Termekek` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Termekek` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `termekek` ADD COLUMN `ar` INTEGER NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `img` LONGBLOB NOT NULL;

-- CreateTable
CREATE TABLE `KategoriaTermekek` (
    `kategoria_id` INTEGER NOT NULL,
    `termekek_id` INTEGER NOT NULL,

    PRIMARY KEY (`kategoria_id`, `termekek_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KategoriaTermekek` ADD CONSTRAINT `KategoriaTermekek_kategoria_id_fkey` FOREIGN KEY (`kategoria_id`) REFERENCES `Kategoriak`(`kategoria_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KategoriaTermekek` ADD CONSTRAINT `KategoriaTermekek_termekek_id_fkey` FOREIGN KEY (`termekek_id`) REFERENCES `Termekek`(`termekek_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
