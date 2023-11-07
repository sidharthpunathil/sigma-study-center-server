import { Controller, Get, Post, Body, UseGuards, Req, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from './guards/Authentication.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './enum/role.enum';
import { CustomRoles } from './decorator/roles.decorator';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthenticationGuard)
    @Get('google/login')
    handleLogin() {
        return true;
    }

    @Get('google/redirect')
    @UseGuards(AuthenticationGuard)
    handleRedirect() {
        return { msg: 'OK' }
    }

    @Get('authtest')
    authTest() {
        return { msg: "authenticated" };
    }

    @Get('status')
    user(@Req() request: any) {
        console.log(request.user);
        if (request.user) {
            return { msg: 'Authenticated' };
        } else {
            return { msg: 'Not Authenticated' };
        }
    }



    @Get('user')
    @UseGuards(GoogleAuthGuard, RolesGuard)
    @CustomRoles(Roles.user)
    protectedEndpoint3() {
        return 'This is a protected endpoint!';
    }


    @Get('admin')
    @UseGuards(GoogleAuthGuard, RolesGuard)
    @CustomRoles(Roles.admin)
    protectedEndpoint2() {
        return 'This is a protected endpoint!';
    }
}



