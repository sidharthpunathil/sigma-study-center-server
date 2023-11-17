import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwt: JwtService, private readonly configService: ConfigService) { }

  async getToken(
    userId: string,
    email: string,
    role: string
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email, role };
    const secret = this.configService.get<string>('Jwt.secret')
    const expiresIn = this.configService.get<string>('Jwt.expiresIn')
    const token = await this.jwt.signAsync(payload, {
      expiresIn: expiresIn,
      secret: secret,
    });
    return { access_token: token };
  }

  async validateUser(details: any, res?: any) {
    console.log("inside validate user 2", details.user);
    
    let token;

    try {
      const user = await this.userService.getUserByEmail(details.user.email)
      console.log('auth user', user);
      token = await this.getToken(user.id, user.email, user.role)
    } catch (err) {
      const user = await this.userService.createUser({ name: details.displayName, email: details.email })
      token = await this.getToken(user.id, user.email, user.role);

    }
    res.cookie('access_token', token.access_token);
  }
}
