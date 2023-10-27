import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { correctDto } from './dto/correct.dto';
import { answerQuizDto } from './dto/answer-quiz.dto';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizeService: QuizService){}


    @Post('create')
    async createQuiz(@Body() data: any) {
        return this.quizeService.createQuiz(data);
    }

    @Post('answer')
    async answer(@Body() data: answerQuizDto) {
        return this.quizeService.answerQuiz(data);
    }

    @Post('correct')
    async correct(@Body() data: correctDto) {
        return this.quizeService.correct(data);
    }

    @Get('submissions/:id')
    async submissions(@Param('id') id: string, @Query("take") take: number, @Query("skip") skip: number ) {
        return this.quizeService.getAllSubmissions(id, take, skip);
    }

}
