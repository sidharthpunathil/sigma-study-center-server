import { Controller, Get, Post, Body, UseGuards, Req, Request, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './enum/role.enum';
import { CustomRoles } from './decorator/roles.decorator';
import { AuthenticationGuard } from './guards/authendication.guard';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // @UseGuards(AuthenticationGuard)
    @UseGuards(AuthGuard('google'))
    @Get('google/login')
    handleLogin() {
        return true;
    }

    @UseGuards(AuthGuard('google'))
    @Get('google/redirect')
    @Redirect('http://localhost:3001')
    // @UseGuards(AuthenticationGuard)
    async handleRedirect(@Req() req) {
        return this.authService.validateUser(req)
    }

    @UseGuards(GoogleAuthGuard)
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



