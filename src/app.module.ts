import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({isGlobal: true, load: [configuration]}), ConfigModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
