import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { PermissionDto } from "../dtos/Permission.dto";
import { PermissionNameException } from "../exceptions/permission-unique.exception";
import { PermissionNotFoudExpeception } from "../exceptions/permission-not-found.exception";

@Injectable()
export class PermissionService {
    constructor(private prisma: PrismaService) { }

    async findOneById(id: number) {
        const permission = await this.prisma.permission.findUnique({
            where: { id }
        })

        if (!permission) {
            throw new PermissionNotFoudExpeception(id);
        }

        return permission;
    }

    async finAll(page: number = 1, limit: number = 10, searchName?: string) {
        const skip = (page - 1) * limit;
        const where: any = {};
        if (searchName) {
            where.name = { contains: searchName }
        }
        const [permissions, total] = await Promise.all([
            this.prisma.permission.findMany({
                skip,
                take: limit,
                where
            }),
            this.prisma.permission.count({ where })
        ])

        return {
            data: permissions,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }

    async createPermission(permissionDto: PermissionDto) {
        const existingName = await this.prisma.permission.findUnique({
            where: { name: permissionDto.name },
        });

        if (existingName) {
            throw new PermissionNameException(existingName.name);
        }

        return await this.prisma.permission.create({
            data: {
                name: permissionDto.name,
                description: permissionDto.description
            }
        })
    }

    async updatePermission(id: number, permissionDto: PermissionDto) {
        const existing = await this.findOneById(id);
        if (!existing) {
            throw new PermissionNotFoudExpeception(id);
        }
        const existingName = await this.prisma.permission.findUnique({
            where: { name: permissionDto.name },
        });

        if (existingName && id !== existingName.id) {
            throw new PermissionNameException(existingName.name);
        }

        return this.prisma.permission.update({
            where: { id },
            data: {
                name: permissionDto.name,
                description: permissionDto.description
            }
        });

    }

    async deletePermission(id: number) {
        return await this.prisma.permission.delete({
            where: { id }
        });
    }
}