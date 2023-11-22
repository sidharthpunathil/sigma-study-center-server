import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('Jwt.secret'),
      signOptions: { expiresIn: configService.get<string>('Jwt.expiresIn') },

    });
  }
  validate(payload: any) {

    console.log('payload from jwt', payload)

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
