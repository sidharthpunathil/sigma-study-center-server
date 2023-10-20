import { Controller, Get, Post, Body } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizeService: QuizService){}

    @Post('create')
    async createUser(@Body() data: CreateUserDto): Promise<User>{
        return this.quizeService.createUser(data);
        
    }

    @Get('test')
    test() {
        return "testing";
    }
}
