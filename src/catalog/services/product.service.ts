import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto } from '../dtos/ProductCreate.dto';
import { UpdateProductDto } from '../dtos/ProductUpdate.dto'; 
import { ProductNotFoundException } from '../exceptions/catalog-not-founf.exception';
import { ProductNameException } from '../exceptions/catalog-unique.exception';


@Injectable()
export class ProductService{
    constructor(private prisma: PrismaService) { }
    async findOneById(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id }
        });
        if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        return product;
    }
    async findAll() {
        return await this.prisma.product.findMany();
    }
    async createProduct(data: CreateProductDto) {
        return this.prisma.product.create({ data });
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto) {
        const existing = await this.findOneById(id);
        if (!existing) {
            throw new ProductNotFoundException(id);
        }
        const existingName = await this.prisma.product.findUnique({
            where: { name: updateProductDto.name},
        });
        if (existingName && id !== existingName.id) {
            throw new ProductNameException(existingName.name);
        }
        return await this.prisma.product.update({
            where: { id },
            data: {
                name: updateProductDto.name,
                description: updateProductDto.description,
                price: updateProductDto.price,
                stock: updateProductDto.stock,
                categoryId: updateProductDto.categoryId,
            }
        });
    }

    async deleteProduct(id: number) {
        return await this.prisma.product.delete({
            where: { id }
        });
    }

    async addImage(productId: number, url: string) {
        await this.findOneById(productId); // check exists
        return this.prisma.productImage.create({
            data: {
                productId,
                url,
            },
        });
    }

    async getImages(productId: number) {
        await this.findOneById(productId);
        return this.prisma.productImage.findMany({
            where: { productId },
        });
    }
}