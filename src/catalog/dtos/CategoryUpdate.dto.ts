import { IsString, IsOptional } from "class-validator";

export class UpdateCategoryDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description: string;
}