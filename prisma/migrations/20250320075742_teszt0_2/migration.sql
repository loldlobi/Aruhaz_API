/*
  Warnings:

  - Added the required column `user_id` to the `Termekek` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `termekek` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Termekek` ADD CONSTRAINT `Termekek_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
