import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User, optionMCQ, optionText, Summissions } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { Roles } from './enum/Roles.enum';


@Injectable()
export class QuizService {
    constructor(private prisma: PrismaService) { }

    async createUser(data: CreateUserDto): Promise<User> {
        const { name, email } = data;

        if (!name || !email) {
            throw new ConflictException('Name and email are required fields.');
        }

        const role = Roles.user;

        try {
            const prismaCreateInput: Prisma.UserCreateInput = {
                name,
                email,
                role: role as Roles,
            };

            return await this.prisma.user.create({
                data: prismaCreateInput,
            });

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Email already exists.');
                }
                throw new ConflictException('Error');
            }
        }
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new ConflictException(`User with email ${email} not found.`);
        }
        return user;
    }

    async createQuiz(data: any): Promise<object> {
        const { heading, description, type, mcqOptions, textOption, email } = data;

        const user = await this.getUserByEmail(email);

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


    async createMCQOption(mcqOptions: any, quizId: number): Promise<optionMCQ> {
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

    async createTextOption(textOption: any, quizId: number): Promise<optionText> {
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

    async answerQuiz(answer): Promise<Summissions> {
        try {
            return await this.prisma.summissions.create({
                data: {
                    answer: answer.submission,
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
            throw new BadRequestException('Invalid Request Object');
        }
    }
}