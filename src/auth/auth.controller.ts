import { Controller, Get, Post, Body, UseGuards, Req, Request, Redirect, Res, InternalServerErrorException, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './enum/role.enum';
import { CustomRoles } from './decorator/roles.decorator';
import { AuthenticationGuard } from './guards/authendication.guard';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { ConfigService } from '@nestjs/config';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigService) { }

    @UseGuards(AuthenticationGuard)
    @Get('google/login')
    handleLogin() {
    }

    @UseGuards(AuthenticationGuard)
    @Get('google/redirect')
    @Redirect()
    async handleRedirect(@Req() req, @Res({ passthrough: true }) res) {
        try {
        await this.authService.validateUser(req, res);
           const redirectUrl = await this.configService.get<string>('Misc.frontendUrl');
           return { url: redirectUrl };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @CustomRoles(Roles.user)
    @Get('authtest')
    adminAuthTest() {
        return "Admin auth testpoint!";
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @CustomRoles(Roles.admin)
    @Get('authtest')
    userAuthTest() {
        return "User auth testpoint!";
    }
}



