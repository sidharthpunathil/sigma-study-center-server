import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { StorageService } from 'src/storage/storage.service';

@Module({
  providers: [QuizService, PrismaService, UserService, StorageService],
  controllers: [QuizController]
})
export class QuizModule {}
