import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { QuizModule } from './quiz/quiz.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';
import { PassportModule } from '@nestjs/passport';
import configuration from './config/configuration';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({isGlobal: true, load: [configuration]}),PassportModule.register({ session: true }), QuizModule, AuthModule, UserModule, StorageModule, ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
