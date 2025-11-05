import { IsString, IsOptional } from "class-validator";

export class RegistUserDTO {
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    name?: string

}