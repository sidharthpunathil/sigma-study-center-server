import { Controller, Get, Post, Body, UseGuards, Req, Request, Redirect, Res, InternalServerErrorException, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './enum/role.enum';
import { CustomRoles } from './decorator/roles.decorator';
import { AuthenticationGuard } from './guards/authendication.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth-guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthenticationGuard)
    @Get('google/login')
    handleLogin() {
    }

    @UseGuards(AuthenticationGuard)
    @Get('google/redirect')
    @Redirect('http://localhost:3001')
    async handleRedirect(@Req() req, @Res({ passthrough: true }) res) {
        try {
           return await this.authService.validateUser(req, res);
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @CustomRoles(Roles.user)
    @Get('authtest')
    authTest() {
        return "haha";
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('test2')
    test2(@Req() req) {
        console.log(req.user);
       return "haha";
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
    @UseGuards(RolesGuard)
    @CustomRoles(Roles.user)
    protectedEndpoint3() {
        return 'This is a protected endpoint!';
    }


    @Get('admin')
    @UseGuards(RolesGuard)
    @CustomRoles(Roles.admin)
    protectedEndpoint2() {
        return 'This is a protected endpoint!';
    }
}



