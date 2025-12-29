import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoryDto } from '../dtos/CategoryCreate.dto';
import { UpdateCategoryDto } from '../dtos/CategoryUpdate.dto';
import { CategoryNotFoundException } from '../exceptions/catalog-not-founf.exception';
import { CategoryNameException } from '../exceptions/catalog-unique.exception';

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

    async findAll() {
        return await this.prisma.category.findMany();
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