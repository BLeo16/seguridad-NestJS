import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOneById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                roles: {
                    select: {
                        id: true,
                        name: true
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return user;
    }

    async findOneByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException(`Usuario con email ${email} no encontrado`);
        }

        return user;
    }


    async createUser(email: string, password: string, name?: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
    }

    async updateUserRoles(id: number, roles: string[]) {
        // 1. Verificar que el usuario exista
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        let rolesFound = [];
        if (roles.length > 0) {
            rolesFound = await this.prisma.role.findMany({
                where: {
                    name: { in: roles },
                },
            });

            if (rolesFound.length !== roles.length) {
                throw new NotFoundException(`Algunos roles no son válidos`);
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                roles: {
                    set: [], 
                    connect: rolesFound.map((r) => ({ id: r.id })), // Conecta los nuevos (si los hay)
                },
            },
            include: {
                roles: {
                    select: { id: true, name: true }
                },
            },
        });

        return updatedUser;
    }

    async findAll(page: number = 1, limit: number = 10, searchEmail?: string) {
        const skip = (page - 1) * limit;
        const where: any = {};
        if (searchEmail) {
            where.email = { contains: searchEmail }
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                where,
                include: {
                    roles: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }),
            this.prisma.user.count({ where })
        ]);

        return {
            data: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }

    async updateUserStatus(id: number, status: UserStatus) {
        // Verificar que el usuario exista
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        // Actualizar el status
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { status },
            include: {
                roles: {
                    include: { permissions: true },
                },
            },
        });

        return updatedUser;
    }

}
