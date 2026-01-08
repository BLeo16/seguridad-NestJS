import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto } from '../dtos/ProductCreate.dto';
import { UpdateProductDto } from '../dtos/ProductUpdate.dto'; 
import { ProductNotFoundException } from '../exceptions/catalog-not-founf.exception';
import { ProductNameException } from '../exceptions/catalog-unique.exception';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';


@Injectable()
export class ProductService{
    constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService) { }
    async findOneById(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { images: true },
        });
        if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        return product;
    }
    async findAll() {
        return await this.prisma.product.findMany({
            include: { images: true },
        });
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

    async addImage(productId: number, file: Express.Multer.File) {
        await this.findOneById(productId); // check exists
        const url = await this.cloudinaryService.uploadImage(file);
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

    async removeImage(productId: number, imageId: number) {
        await this.findOneById(productId);
        const image = await this.prisma.productImage.findFirst({
            where: { id: imageId, productId },
        });
        if (!image) {
            throw new NotFoundException(`Imagen con ID ${imageId} no encontrada para el producto ${productId}`);
        }
        await this.cloudinaryService.deleteImage(image.url);
        return this.prisma.productImage.delete({
            where: { id: imageId },
        });
    }
}