import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private jwt: JwtService,){}

    async getToken(
        userId: string,
        email: string,
      ): Promise<{ access_token: string }> {
        const payload = { sub: userId, email };
        const secret = 'JWT_SECRET';
        const token = await this.jwt.signAsync(payload, {
          expiresIn: '15m',
          secret: secret,
        });
        return { access_token: token };
      }


    async validateUser(details: any) {
        console.log("inside validate user", details.user);
        const user: User = await this.userService.getUserByEmail(details.user.email)
        console.log('auth user', user);

        if(!user) {
            console.log("insid !user")
            const user = await this.userService.createUser({name: details.displayName, email: details.email})
            return this.getToken(user.id, user.email);
        }

        return this.getToken(user.id, user.email);
    }

    async findUser(email) {
        const user = await this.userService.getUserByEmail(email);
        console.log(user)
        return user;
    }


}
