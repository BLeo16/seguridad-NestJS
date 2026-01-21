import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100,{
    message: 'El nombre no puede superar los 100 caracteres',
  })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500,{
    message: 'La descripción no puede superar los 500 caracteres',
  })
  description?: string;
}