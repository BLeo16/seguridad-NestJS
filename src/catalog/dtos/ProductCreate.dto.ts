import { IsString, IsNumber, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(100, {
    message: 'El nombre no puede superar los 100 caracteres',
  })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000,{
    message: 'La descripción no puede superar los 1000 caracteres',
  })
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