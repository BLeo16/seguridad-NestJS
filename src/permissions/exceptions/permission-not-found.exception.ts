import { HttpException, HttpStatus } from "@nestjs/common";

export class PermissionNotFoudExpeception extends HttpException{
    constructor(permissionId:number){
        super(`Permiso con ID ${permissionId} no encontrado`, HttpStatus.NOT_FOUND);
    }
}