import { IsString, IsOptional, Length } from "class-validator";

export class PermissionDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    @Length(0, 100)
    description?: string;
}