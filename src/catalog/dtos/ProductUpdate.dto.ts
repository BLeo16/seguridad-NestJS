import { IsString, IsNumber, IsInt, IsOptional, Min, MaxLength, Max } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(1000)
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