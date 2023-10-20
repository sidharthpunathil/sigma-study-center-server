import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [QuizService, PrismaService],
  controllers: [QuizController]
})
export class QuizModule {}
