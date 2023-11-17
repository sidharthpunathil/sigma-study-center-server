import { AuthGuard } from "@nestjs/passport";

export class AuthenticationGuard extends AuthGuard('google') {
    constructor(){
        super({
            accessType: 'offline',
          });
    }
}