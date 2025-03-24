-- DropForeignKey
ALTER TABLE `termekek` DROP FOREIGN KEY `Termekek_user_id_fkey`;

-- DropIndex
DROP INDEX `Termekek_user_id_fkey` ON `termekek`;

-- CreateTable
CREATE TABLE `TermekekUser` (
    `user_id` INTEGER NOT NULL,
    `termekek_id` INTEGER NOT NULL,

    PRIMARY KEY (`user_id`, `termekek_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TermekekUser` ADD CONSTRAINT `TermekekUser_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TermekekUser` ADD CONSTRAINT `TermekekUser_termekek_id_fkey` FOREIGN KEY (`termekek_id`) REFERENCES `Termekek`(`termekek_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
