import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../enum/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Roles[]>('roles', context.getHandler());
    console.log("from roles guard", roles);
    if (!roles || roles.length === 0) {
      return true; 
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.some(role => user.role.includes(role)); 
  }
}
