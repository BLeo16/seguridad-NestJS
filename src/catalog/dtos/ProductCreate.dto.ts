import { IsString, IsNumber, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsInt()
  categoryId: number;
}