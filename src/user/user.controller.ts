import { Controller, Post, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post('create')
    async createUser(@Body() data: CreateUserDto): Promise<User>{
        return this.userService.createUser(data);
        
    }
}
