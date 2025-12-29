import { IsString, IsNumber, IsInt, IsOptional, Min } from "class-validator";

export class UpdateProductDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
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