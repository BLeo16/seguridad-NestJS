import { HttpStatus, HttpException } from "@nestjs/common";

export class CategoryNotFoundException extends HttpException {
    constructor(categoryId: number) {
        super(`Categoría con ID ${categoryId} no encontrado`, HttpStatus.NOT_FOUND);
    }
}

export class ProductNotFoundException extends HttpException {
    constructor(productId: number) {
        super(`Producto con ID ${productId} no encontrado`, HttpStatus.NOT_FOUND);
    }
}