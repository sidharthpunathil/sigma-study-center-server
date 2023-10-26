/*
  Warnings:

  - The primary key for the `Quiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Quiz` table. All the data in the column will be lost.
  - The primary key for the `Summissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Summissions` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `optionMCQ` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `optionMCQ` table. All the data in the column will be lost.
  - The primary key for the `optionText` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `optionText` table. All the data in the column will be lost.
  - The required column `_id` was added to the `Quiz` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `_id` was added to the `Summissions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `_id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `_id` was added to the `optionMCQ` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `_id` was added to the `optionText` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `Quiz` DROP FOREIGN KEY `Quiz_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `Summissions` DROP FOREIGN KEY `Summissions_quizId_fkey`;

-- DropForeignKey
ALTER TABLE `Summissions` DROP FOREIGN KEY `Summissions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `optionMCQ` DROP FOREIGN KEY `optionMCQ_mcqId_fkey`;

-- DropForeignKey
ALTER TABLE `optionText` DROP FOREIGN KEY `optionText_quizId_fkey`;

-- AlterTable
ALTER TABLE `Quiz` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`_id`);

-- AlterTable
ALTER TABLE `Summissions` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`_id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`_id`);

-- AlterTable
ALTER TABLE `optionMCQ` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`_id`);

-- AlterTable
ALTER TABLE `optionText` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`_id`);

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `optionText` ADD CONSTRAINT `optionText_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `optionMCQ` ADD CONSTRAINT `optionMCQ_mcqId_fkey` FOREIGN KEY (`mcqId`) REFERENCES `Quiz`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Summissions` ADD CONSTRAINT `Summissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Summissions` ADD CONSTRAINT `Summissions_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
