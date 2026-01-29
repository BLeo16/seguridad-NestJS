import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { RoleDto } from "../dtos/Role.dto";
import { UpdateRoleDto } from "../dtos/RoleUpdate.dto";
import { RoleNameException } from "../exceptions/role-unique.exception";
import { RoleNotFoundException } from "../exceptions/role-not-found.exception";

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async findOneById(id: number) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: {
                permissions: true,
            }
        })

        if (!role) {
            throw new NotFoundException(`Rol con ID ${id} no encontrado`)
        }
        return role;
    }

    async findAll(page: number = 1, limit: number = 10, searchName: string) {
        const skip = (page - 1) * limit;
        const where: any = {};
        if (searchName) {
            where.name = { contains: searchName }
        }
        const [roles, total] = await Promise.all([
            this.prisma.role.findMany({
                skip,
                take: limit,
                where,
                include: {
                    permissions: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }),
            this.prisma.role.count({where})
        ])

        return {
            data: roles,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }

    async createRole(roleDto: RoleDto) {
        return await this.prisma.role.create({
            data: {
                name: roleDto.name,
            }
        })

    }
    async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
        const existing = await this.findOneById(id);
        if (!existing) {
            throw new RoleNotFoundException(id);
        }
        const existingName = await this.prisma.role.findUnique({
            where: { name: updateRoleDto.name },
        });

        if (existingName && id !== existingName.id) {
            throw new RoleNameException(existingName.name);
        }

        return await this.prisma.role.update({
            where: { id },
            data: {
                name: updateRoleDto.name,
                permissions: {
                    set: updateRoleDto.permissions?.map(permissionId => ({ id: permissionId })) || []
                }
            }
        })

    }
    async deleteRole(id: number) {
        return await this.prisma.role.delete({
            where: { id }
        });
    }
}