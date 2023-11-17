import { Controller, Get, Post, Body, Query, Param, Put, Delete, UseInterceptors, UploadedFile, UseGuards, Res, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { correctDto } from './dto/correct.dto';
import { answerQuizDto } from './dto/answer-quiz.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { deleteQuizDto } from './dto/delete-quiz.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';
import { EditQuizDto } from './dto/edit-quiz.dto';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { AuthGuard } from '@nestjs/passport';
import { CustomRoles } from 'src/auth/decorator/roles.decorator';
import { Roles } from 'src/auth/enum/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizeService: QuizService, private readonly storageService: StorageService) { }

    @Get('toppers')
    async toppers(@Query("take") take?: number, @Query("skip") skip?: number): Promise<object> {
        return this.quizeService.toppers(take, skip);
    }


    @Get('all')
    async allQuizes(@Query("take") take: number, @Query("skip") skip: number) {
        return this.quizeService.getAllQuizs(take, skip);
    }


    @Get('stats')
    async getQuizStat(@Param('id') id: string) {
        return this.quizeService.getQuizStat(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @CustomRoles(Roles.admin)
    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async createQuiz(@Req() req, @UploadedFile('file') file: Express.Multer.File, @Body() data: CreateQuizDto) {
        console.log(req.user.email, req.user.role, req.user)
        // return this.quizeService.createQuiz(data, file);
        return true
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


    @Get('evaluate/:id')
    async getAllSubmissionsToEvaluate(@Param('id') id: string, @Query("take") take: number, @Query("skip") skip: number) {
        return this.quizeService.getAllSubmissionsToEvaluate(id, take, skip);
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


    @Get(':id')
    async getQuiz(@Param('id') id: string) {
        return this.quizeService.getQuiz(id);
    }

}
