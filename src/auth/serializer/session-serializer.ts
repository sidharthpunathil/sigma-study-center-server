import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User } from '@prisma/client'
import { UserService } from "src/user/user.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        @Inject('AUTH_SERVICE') private readonly AuthService: AuthService, private readonly userService: UserService
    ){
        super();
    }

    serializeUser(user: User, done: Function) {
        console.log('serializeUser');
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
        console.log('deserializeUser');
        const user = await this.AuthService.findUser(payload.email);
        return user ? done(null, user) : done(null, null);
      }
}