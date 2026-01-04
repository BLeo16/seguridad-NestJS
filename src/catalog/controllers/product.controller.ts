import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/ProductCreate.dto';
import { UpdateProductDto } from '../dtos/ProductUpdate.dto';
import { ProductImageDto } from '../dtos/ProductImageDto';


@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get(':id')
    async getProductById(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOneById(id);
    }

    @Get()
    async getAllProducts() {
        return this.productService.findAll();
    }

    @Post()
    async createProduct(@Body() ProductDto: CreateProductDto) {
        return this.productService.createProduct(ProductDto);
    }

    @Put(':id')
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProduct: UpdateProductDto
    ) {
        return this.productService.updateProduct(id, updateProduct)
    }

    @Delete(':id')
    async deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productService.deleteProduct(id)
    }

    @Post(':id/images')
    async addImage(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ProductImageDto
    ) {
        return this.productService.addImage(id, dto.url);
    }

    @Get(':id/images')
    async getImages(@Param('id', ParseIntPipe) id: number) {
        return this.productService.getImages(id);
    }
}