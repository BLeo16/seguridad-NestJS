import { HttpException, HttpStatus } from "@nestjs/common";

export class RoleNotFoundException extends HttpException {
    constructor(roleId: number) {
        super(`Rol con ID ${roleId} no encontrado`, HttpStatus.NOT_FOUND);
    }
}