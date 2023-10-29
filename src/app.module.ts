import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { QuizModule } from './quiz/quiz.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';
import configuration from './config/configuration';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({isGlobal: true, load: [configuration]}), ConfigModule, QuizModule, AuthModule, UserModule, StorageModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
