import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    // 🔹 Buscar usuario por ID (incluye roles y permisos)
    async findOneById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return user;
    }

    // 🔹 Buscar usuario por email (incluye roles y permisos)
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
        // Verificar que el usuario exista
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        // Buscar los roles existentes por nombre
        const rolesFound = await this.prisma.role.findMany({
            where: {
                name: { in: roles },
            },
        });

        if (rolesFound.length === 0) {
            throw new NotFoundException(
                `No se encontraron roles válidos: ${roles.join(', ')}`,
            );
        }

        // Actualizar relación M:N entre usuario y roles
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                roles: {
                    set: [], // elimina roles actuales
                    connect: rolesFound.map((r) => ({ id: r.id })), // asigna nuevos
                },
            },
            include: {
                roles: {
                    include: { permissions: true },
                },
            },
        });

        return updatedUser;
    }

}
