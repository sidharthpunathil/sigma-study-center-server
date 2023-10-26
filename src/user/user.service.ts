import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, Roles, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }

    async findUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        });
        console.log(user)
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return null
            // throw new Error(`User with email ${email} not found.`);
        }
        return user;
    }

    async createUser(data: CreateUserDto): Promise<User> {

        console.log("incoming data", data);

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

    async score(data: any): Promise<object> {
        try {

            const user = await this.prisma.user.findUnique({
                where: {
                    id: data.id
                }
            })
            return { "score": user.score }

        } catch (err) {
            throw new ConflictException("Error getting the score");
        }
    }


}
