import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as sessions from 'express-session'
import * as passport from 'passport'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api")
  app.use(sessions({
    secret: 'SECRET',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 600000,
    }
  }))

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(passport.initialize())
  app.use(passport.session())
  await app.listen(3000);
}
bootstrap();
