import { HttpException, HttpStatus } from "@nestjs/common";

export class CategoryNameException extends HttpException {
    constructor(name: string) {
        super(`Ya existe una categoría con el nombre: ${name} `, HttpStatus.CONFLICT)
    }
}

export class ProductNameException extends HttpException {
    constructor(name: string) {
        super(`Ya existe un producto con el nombre: ${name} `, HttpStatus.CONFLICT)
    }
}