import { HttpException, HttpStatus } from "@nestjs/common";

export class RoleNameException extends HttpException {
    constructor(name: string) {
        super(`Ya existe un rol con el nombre: ${name} `, HttpStatus.CONFLICT);
    }
}