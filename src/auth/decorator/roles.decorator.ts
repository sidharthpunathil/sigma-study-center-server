import { SetMetadata } from "@nestjs/common";
import { Roles } from "../enum/role.enum";

export const CustomRoles = (...role: Roles[]) => {
    return SetMetadata(
        'role', role
    )
}