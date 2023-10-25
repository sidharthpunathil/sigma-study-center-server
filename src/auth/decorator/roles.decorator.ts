import { SetMetadata } from "@nestjs/common";
import { Roles } from "../enum/role.enum";

export const CustomRoles = (...roles: Roles[]) => {
    return SetMetadata(
        'roles', roles
    )
}