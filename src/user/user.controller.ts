import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { changeUserNameDto } from './dto/change-username.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post('create')
    async createUser(@Body() data: CreateUserDto): Promise<User>{
        return this.userService.createUser(data);
    }

    @Get('score')
    async getUserScore(@Body() data: any): Promise<object> {
        return this.userService.score(data);
    }

    @Put('change/name')
    async changeUserName(@Body() changeUserNameDto: changeUserNameDto): Promise<User> {
        return this.userService.changeUserName(changeUserNameDto);
    }
}