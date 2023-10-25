import { Controller, Get, Post, Body } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizeService: QuizService){}


    @Post('create')
    async createQuiz(@Body() data: any) {
        return this.quizeService.createQuiz(data);
    }

    @Post('answer')
    async answer(@Body() data: any) {
        return this.quizeService.answerQuiz(data);
    }

}
