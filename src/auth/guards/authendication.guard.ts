import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class AuthendicationGuard extends AuthGuard('google') {
    constructor(){
        super({
            accessType: 'offline',
          });
    }
    async canActivate(context: ExecutionContext) {
        const activate = await super.canActivate(context) as boolean;
        const request = context.switchToHttp().getRequest()
        await super.logIn(request);
        return activate
    }
}