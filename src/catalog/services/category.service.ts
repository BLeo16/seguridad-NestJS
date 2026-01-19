import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoryDto } from '../dtos/CategoryCreate.dto';
import { UpdateCategoryDto } from '../dtos/CategoryUpdate.dto';
import { CategoryNotFoundException } from '../exceptions/catalog-not-founf.exception';
import { CategoryNameException } from '../exceptions/catalog-unique.exception';
import { contains } from 'class-validator';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    async findOneById(id: number) {
        const category = await this.prisma.category.findUnique({
            where: { id }
        });
        if (!category) throw new NotFoundException(`Categoría con ID ${id} no encontrado`);
        return category;
    }

    async findAll(page: number = 1, limit: number = 10, searchName?: string) {
        const skip = (page - 1) * limit;
        const where = searchName ? { name: { contains: searchName } } : {};
        return await this.prisma.category.findMany({
            where,
            skip,
            take: limit
        });
    }

    async findAllPaginated(page: number = 1, limit: number = 10, searchName?: string) {
        const skip = (page - 1) * limit;
        const where:any ={};
        if (searchName){
            where.name = {contains: searchName}
        }
        const [categories, total] = await Promise.all([
            this.prisma.category.findMany({
                skip,
                take: limit,
                 where,
            }),
            this.prisma.category.count({ where }),
        ]);

        return {
            data: categories,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    }

    async createCategory(data: CreateCategoryDto) {
        return this.prisma.category.create({ data });
    }

    async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
        const existing = await this.findOneById(id);
        if (!existing) {
            throw new CategoryNotFoundException(id);
        }
        const existingName = await this.prisma.role.findUnique({
            where: { name: updateCategoryDto.name },
        });

        if (existingName && id !== existingName.id) {
            throw new CategoryNameException(existingName.name);
        }

        return await this.prisma.category.update({
            where: { id },
            data: {
                name: updateCategoryDto.name,
                description: updateCategoryDto.description,
            }
        });
    }

    async deleteCategory(id: number) {
        return await this.prisma.category.delete({
            where: { id }
        });
    }

}