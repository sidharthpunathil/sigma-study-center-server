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

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `optionText` ADD CONSTRAINT `optionText_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `optionMCQ` ADD CONSTRAINT `optionMCQ_mcqId_fkey` FOREIGN KEY (`mcqId`) REFERENCES `Quiz`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Summissions` ADD CONSTRAINT `Summissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Summissions` ADD CONSTRAINT `Summissions_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE;
