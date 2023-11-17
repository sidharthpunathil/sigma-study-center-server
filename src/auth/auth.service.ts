import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwt: JwtService,) { }

  async getToken(
    userId: string,
    email: string,
    role: string
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email, role };
    const secret = 'JWT_SECRET';
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
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

    res.cookie('refresh_token', token.refreshToken);
    res.cookie('access_token', token.access_token);

  }

  async findUser(email) {
    const user = await this.userService.getUserByEmail(email);
    console.log(user)
    return user;
  }


}
