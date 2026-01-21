import { IsString, IsNumber, IsInt, IsOptional, Min, MaxLength, Max } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @MaxLength(100, {
        message: 'El nombre no puede superar los 100 caracteres',
    })
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(1000, {
        message: 'La descripción no puede superar los 1000 caracteres',
    })
    description: string;

    @IsNumber()
    price: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    stock: number;

    @IsInt()
    categoryId: number;
}