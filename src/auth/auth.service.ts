import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService){}

    async validateUser(details: any) {
        console.log(details);
        const user = await this.userService.getUserByEmail(details.email)
        console.log('auth user', user);
        if (user) return user;

        if(!user) {
            console.log("insid !user")
            const user = await this.userService.createUser({name: details.displayName, email: details.email})
            if (user) return true
        }
    }

    async findUser(email) {
        const user = await this.userService.getUserByEmail(email);
        console.log(user)
        return user;
    }


}
