import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { optionMCQ, optionText, Summissions } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { correctDto } from './dto/correct.dto';
import { answerQuizDto } from './dto/answer-quiz.dto';
import { deleteQuizDto } from './dto/delete-quiz.dto';
import { StorageService } from 'src/storage/storage.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { EditQuizDto } from './dto/edit-quiz.dto';

@Injectable()
export class QuizService {
    constructor(private prisma: PrismaService, private userService: UserService, private storageService: StorageService) { }

    async createQuiz(data: CreateQuizDto, file: Express.Multer.File): Promise<object> {
        try {
            let { heading, description, type, mcqOptions, textOption, email, score } = data;


            if (typeof score === 'string') {
                score = parseInt(score, 0);
            } else if (typeof score === 'undefined') {
                score = 0;
            }


            const user = await this.userService.getUserByEmail(email);

            let quiz;

            // User can decide to upload a file or not

            if (file) {
                const fileId = file && await this.storageService.uploadFile(file)
                quiz = await this.prisma.quiz.create({

                    data: {
                        author: {
                            connect: {
                                id: user.id,
                            },
                        },
                        heading,
                        description,
                        type,
                        score,
                        multimedia: fileId.url
                    },
                });
            } else {
                quiz = await this.prisma.quiz.create({

                    data: {
                        author: {
                            connect: {
                                id: user.id,
                            },
                        },
                        heading,
                        description,
                        score,
                        type,
                    },
                });
            }

            // It can be either mcq or text type questions

            if (type === 'mcq' && mcqOptions && user) {

                console.log("mcqq")

                const createdMCQOption = await this.createMCQOption(mcqOptions, quiz.id);
                return await this.prisma.quiz.update({
                    where: {
                        id: quiz.id,
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

                console.log("texteee")

                const createdTextOption = await this.createTextOption(textOption, quiz.id);
                return await this.prisma.quiz.update({
                    where: {
                        id: quiz.id,
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
                throw new BadRequestException('Error');
            }
        }
        catch (err) {
            console.log(err)
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

            const submission = await this.prisma.summissions.findFirst({
                where: { userId: answer.userId },
            });

            if (submission && submission.quizId == answer.quizId) {
                throw new HttpException('User already submitted the quiz!', HttpStatus.FORBIDDEN);
            }

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
            if (err.status == HttpStatus.FORBIDDEN) {
                throw new HttpException('User already submitted the quiz!', HttpStatus.FORBIDDEN);
            }
            else {
                console.log(err)
                throw new NotFoundException('Invalid Request Object');
            }
        }
    }

    // An optimization can be done here or a seperate endpoint 
    // can be created to reduce the score of the user

    async correct(data: correctDto): Promise<Summissions> {
        try {
            if (data.status == true) {
                const submission = await this.prisma.summissions.findUnique({
                    where: {
                        id: data.submissionId
                    }
                })

                const quiz = await this.prisma.quiz.findUnique({
                    where: {
                        id: submission.quizId
                    }
                })

                console.log("quiz", quiz);

                const score = quiz.score

                console.log("score to incremnet", score);

                await this.prisma.user.update({
                    where: {
                        id: submission.userId
                    },
                    data: {
                        score: { increment: score }
                    }
                })
            }

            // Condition to check if the submission is already evaluated, 
            // and now we have to change the status also reduce the score 
            // that was added when the submission was evaluated!

            const submission = await this.prisma.summissions.findUnique({
                where: {
                    id: data.submissionId
                }
            })

            if (data.status == false && submission.status == true) {

                const currentQuiz = await this.prisma.quiz.findUnique({
                    where: {
                        id: submission.quizId
                    }
                })

                const currentQuizScore = currentQuiz.score

                await this.prisma.user.update({
                    where: {
                        id: submission.userId
                    },
                    data: {
                        score: { decrement: currentQuizScore }
                    }
                })
            } 

            return await this.prisma.summissions.update({
                where: {
                    id: data.submissionId,
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

    async getAllSubmissionsToEvaluate(id: string, take?: number, skip?: number) {
        try {
            return await this.prisma.summissions.findMany({
                where: {
                    quizId: id,
                    status: null
                },
                skip: skip ? +skip: undefined,
                take: +take ? +take : undefined,
            })
        } catch (err) {
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

    async getAllQuizs(take?: number, skip?: number) {
        try {
            return await this.prisma.quiz.findMany({
                skip: skip ? +skip : undefined,
                take: take ? +take : undefined,
            })
        } catch (err) {
            console.log(err);
            throw new BadRequestException('Invalid Request Object')
        }
    }

    async getQuiz(id: string) {
        try {
            return await this.prisma.quiz.findUnique({
                where: {
                    id: id
                }
            })

        } catch (err) {
            console.log(err);
            throw new BadRequestException('Invalid Request Object')
        }
    }

    async getQuizStat(id: string) {
        let pending = 0;
        let correct = 0;
        let incorrect = 0;

        try {

            const submissions = await this.prisma.summissions.findMany({
                where: {
                    quizId: id
                }
            })

            submissions.find((submission) => {
                if (submission.status == null) {
                    pending += 1;
                } else if (submission.status == true) {
                    correct += 1;
                } else if (submission.status == false) {
                    incorrect += 1;
                }
            })

            const total = submissions.length;
            const evaluated = correct + incorrect;

            console.log("stats", total, pending, correct, incorrect, evaluated)

            return {
                total,
                pending,
                correct,
                incorrect,
                evaluated
            }
        } catch (err) {
            console.log(err);
            throw new BadRequestException('Invalid Request Object')
        }
    }

    async toppers(data: any) {
        try {

            const topUsers = await this.prisma.user.findMany({
                orderBy: {
                    score: 'desc',
                },
                take: data.limit,
            });
            return topUsers;

        } catch (err) {
            throw new BadRequestException('Invalid Request Object')
        }
    }

    async editQuiz(data: EditQuizDto, file: Express.Multer.File): Promise<object> {
        const { quizId, ...query } = data
        if (file) {
            const fileUpload = await this.storageService.uploadFile(file);
            query.multimedia = fileUpload.url
        }
        try {

            return await this.prisma.quiz.update({
                where: {
                    id: quizId
                },
                data: query
            });
        }

        catch (err) {
            console.log(err);
            throw new BadRequestException('Invalid Request Object');
        }
    }

    async deleteQuiz(data: deleteQuizDto) {
        try {
            await this.prisma.quiz.delete({
                where: { id: data.quizId },
            });

            return `quiz ${data.quizId} deleted successfully!`
        } catch (err) {
            console.log(err)
            throw new Error(`Failed to delete quiz with ID ${data.quizId}: ${err.message}`);
        }
    }
}