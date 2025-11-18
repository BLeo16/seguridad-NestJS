import { IsString, IsArray, IsOptional } from "class-validator";

export class UpdateRoleDto {
    @IsString()
    name: string;

    @IsArray()
    @IsOptional()
    permissions?: number[]; 
}