import { Controller, Get, Post, Body, Query, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { correctDto } from './dto/correct.dto';
import { answerQuizDto } from './dto/answer-quiz.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { deleteQuizDto } from './dto/delete-quiz.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';
import { EditQuizDto } from './dto/edit-quiz.dto';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizeService: QuizService, private readonly storageService: StorageService) { }


    @Get('all')
    async allQuizes(@Query("take") take: number, @Query("skip") skip: number) {
        return this.quizeService.getAllQuizs(take, skip);
    }

    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async createQuiz(@UploadedFile('file') file: Express.Multer.File, @Body() data: CreateQuizDto) {
        return this.quizeService.createQuiz(data, file);
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
    async submissions(@Param('id') id: string, @Query("take") take: number, @Query("skip") skip: number) {
        return this.quizeService.getAllSubmissions(id, take, skip);
    }

    @Get('toppers')
    async toppers(@Body() data: any) {
        return this.quizeService.toppers(data);
    }

    @Put('edit')
    @UseInterceptors(FileInterceptor('file'))
    async editQuiz(@UploadedFile() file: Express.Multer.File, @Body() data: EditQuizDto): Promise<object> {
        return await this.quizeService.editQuiz(data, file);
    }

    @Delete('delete')
    async deleteQuiz(@Body() data: deleteQuizDto) {
        return this.quizeService.deleteQuiz(data);
    }
}
