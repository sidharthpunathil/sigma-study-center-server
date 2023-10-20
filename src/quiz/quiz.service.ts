import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';

enum Roles {
    admin = 'admin',
    user = 'user',
    god = 'god'
}

@Injectable()
export class QuizService {
    constructor(private prisma: PrismaService) { }

    async createUser(data: CreateUserDto): Promise<User > {
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

        }catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                throw new ConflictException('Email already exists.');
              }
                throw new ConflictException('Email already exists.');
            }
          }
          
    }
}