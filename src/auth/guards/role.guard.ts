import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../enum/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Roles[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true; 
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(request.user)

    // It is role in prisma schema [so we can only look for on role at a time]

    return roles.some(role => user.role.includes(role)); 
  }
}