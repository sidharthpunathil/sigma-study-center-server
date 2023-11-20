import { Injectable, NotFoundException } from '@nestjs/common';
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

  async validateUser(req: any, res?: any) {
    console.log("inside validate user 2", req.user);
    
    let token, user;

    try {
      user = await this.userService.getUserByEmail(req.user.email)
      if (user) {
        token = await this.getToken(user.id, user.email, user.role)
      } else {
        throw new NotFoundException('User not found');
      }

    } catch (err) {
      console.log(err)
      user = await this.userService.createUser({ name: req.user.name, email: req.user.email })
      token = await this.getToken(user.id, user.email, user.role);
    }

    // ![This is not the right way to do it]
    // It should not be done like this, but for the sake of simplicity
    // we are storing the user details in the cookie

    res.cookie('user', user.id)
    res.cookie('email', user.email)
    res.cookie('role', user.role)
    res.cookie('access_token', token.access_token);
  }
}
