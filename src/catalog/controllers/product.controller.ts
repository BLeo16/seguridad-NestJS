import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/ProductCreate.dto';
import { UpdateProductDto } from '../dtos/ProductUpdate.dto';
import { ProductImageDto } from '../dtos/ProductImageDto';
import { HasPermission } from 'src/auth/decorators/has-permission.decorator';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get(':id')
    async getProductById(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOneById(id);
    }

    @Get()
    async getAllProducts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('searchName') searchName?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('categoryIds') categoryIds?: string,
    ) {
        const minPriceNum = minPrice ? parseFloat(minPrice) : undefined;
        const maxPriceNum = maxPrice ? parseFloat(maxPrice) : undefined;
        const categoryIdsArray = categoryIds ? categoryIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : undefined;
        return this.productService.findAll(page, limit, searchName, minPriceNum, maxPriceNum, categoryIdsArray);
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @HasPermission('CREAR_PRODUCTOS')
    @Post()
    async createProduct(@Body() ProductDto: CreateProductDto) {
        return this.productService.createProduct(ProductDto);
    }
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @HasPermission('EDITAR_PRODUCTOS')
    @Put(':id')
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProduct: UpdateProductDto
    ) {
        return this.productService.updateProduct(id, updateProduct)
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @HasPermission('ELIMINAR_PRODUCTOS')
    @Delete(':id')
    async deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productService.deleteProduct(id)
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @HasPermission('EDITAR_PRODUCTOS')
    @Post(':id/images')
    @UseInterceptors(FileInterceptor('file'))
    async addImage(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.productService.addImage(id, file);
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @HasPermission('VER_PRODUCTOS')
    @Get(':id/images')
    async getImages(@Param('id', ParseIntPipe) id: number) {
        return this.productService.getImages(id);
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @HasPermission('EDITAR_PRODUCTOS')
    @Delete(':id/images/:imageId')
    async removeImage(
        @Param('id', ParseIntPipe) id: number,
        @Param('imageId', ParseIntPipe) imageId: number
    ) {
        return this.productService.removeImage(id, imageId);
    }

    @Get("slug/:slug")
    async getProductBySlug(@Param('slug') slug: string) {
        return this.productService.findOneBySlug(slug);
    }
}