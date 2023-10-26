import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleStrategy } from './strategy/google-strategy';
import { SessionSerializer } from './serializer/session-serializer';

@Module({
  providers: [AuthService, ConfigService, UserService, PrismaService, GoogleStrategy, SessionSerializer, {
    provide: 'AUTH_SERVICE',
    useClass: AuthService
  }],
  controllers: [AuthController],
})
export class AuthModule { }
