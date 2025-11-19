import { HttpException, HttpStatus } from "@nestjs/common";

export class PermissionNameException extends HttpException {
    constructor(permissionName: string) {
        super(`Ya existe un permiso con el nombre ${permissionName}`, HttpStatus.CONFLICT);
    }
}