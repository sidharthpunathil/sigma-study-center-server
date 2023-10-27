import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { User, optionMCQ, optionText, Summissions } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { correctDto } from './dto/correct.dto';
import { answerQuizDto } from './dto/answer-quiz.dto';


@Injectable()
export class QuizService {
    constructor(private prisma: PrismaService, private userService: UserService) { }

    async createQuiz(data: any): Promise<object> {
        const { heading, description, type, mcqOptions, textOption, email } = data;

        const user = await this.userService.getUserByEmail(email);
        console.log(user);

        const quize = await this.prisma.quiz.create({
            data: {
                author: {
                    connect: {
                        id: user.id,
                    },
                },
                heading,
                description,
                type
            },
        });

        if (type === 'mcq' && mcqOptions && user) {
            const createdMCQOption = await this.createMCQOption(mcqOptions, quize.id);
            return await this.prisma.quiz.update({
                where: {
                    id: quize.id,
                },
                data: {
                    optionMCQ: {
                        connect: {
                            id: createdMCQOption.id,
                        },
                    },
                },
                include: {
                    optionMCQ: true,
                },
            });

        } else if (type == 'text' && textOption && user) {

            const createdTextOption = await this.createTextOption(textOption, quize.id);
            return await this.prisma.quiz.update({
                where: {
                    id: quize.id,
                },
                data: {
                    optionText: {
                        connect: {
                            id: createdTextOption.id,
                        },
                    },
                },
                include: {
                    optionText: true,
                },
            });

        } else {
            throw new BadRequestException('Invalid Request Object');
        }
    }


    async createMCQOption(mcqOptions: any, quizId: string): Promise<optionMCQ> {
        return this.prisma.optionMCQ.create({
            data: {
                a: mcqOptions.a,
                b: mcqOptions.b,
                c: mcqOptions.c,
                d: mcqOptions.d,
                quiz: {
                    connect: {
                        id: quizId,
                    },
                },
            },
        });
    }

    async createTextOption(textOption: any, quizId: string): Promise<optionText> {
        return this.prisma.optionText.create({
            data: {
                text: textOption.text,
                quiz: {
                    connect: {
                        id: quizId,
                    },
                },
            },
        });
    }

    async answerQuiz(answer: answerQuizDto): Promise<Summissions> {
        try {
            return await this.prisma.summissions.create({
                data: {
                    answer: answer.answer,
                    Quiz: {
                        connect: {
                            id: answer.quizId
                        }
                    },
                    user: {
                        connect: {
                            id: answer.userId
                        }
                    }
                }
            })
        } catch (err) {
            console.log(err)
            throw new BadRequestException('Invalid Request Object');
        }
    }

    async correct(data: correctDto): Promise<Summissions> {
        try {
            if (data.status == true) {
                const submission = await this.prisma.summissions.findUnique({
                    where: {
                        id: data.id
                    }
                })

                console.log(submission)

                await this.prisma.user.update({
                    where: {
                        id: submission.userId
                    },
                    data: {
                        score: { increment: 1 }
                    }
                })
            }

            return await this.prisma.summissions.update({
                where: {
                    id: data.id,
                },
                data: {
                    status: data.status
                },
            });


        } catch (err) {
            console.log(err);
            throw new BadRequestException('Invalid Request Object')
        }
    }

    async getAllSubmissions(id: string, take: number, skip: number) {
        try {
            return await this.prisma.summissions.findMany({
                where: {
                    quizId: id,
                },
                skip: +skip,
                take: +take,
            })
        } catch (err) {
            throw new BadRequestException('Invalid Request Object')
        }
    }
}