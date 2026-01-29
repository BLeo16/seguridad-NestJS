import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { PermissionDto } from "../dtos/Permission.dto";
import { PermissionService } from "../services/permissions.service";
import { PermissionGuard } from "src/auth/guards/permission.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { HasPermission } from "src/auth/decorators/has-permission.decorator";

@Controller('permission')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PermissionController {
    constructor(private permissionService: PermissionService) { }

    @Get()
    @HasPermission('VER_PERMISOS')
    async getAllPermissions(
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
        @Query('searchName') searchName?: string,
    ) {
        return this.permissionService.finAll(page, limit, searchName);
    }

    @Get(':id')
    @HasPermission('VER_PERMISOS')
    async getPermissionById(@Param('id', ParseIntPipe) id: number) {
        return this.permissionService.findOneById(id);
    }

    @Post()
    @HasPermission('EDITAR_PERMISOS')
    async createPermission(@Body() permissionDto: PermissionDto) {
        return this.permissionService.createPermission(permissionDto);
    }

    @Patch(':id')
    @HasPermission('EDITAR_PERMISOS')
    async updatePermission(
        @Param('id', ParseIntPipe) id: number,
        @Body() permissionDto: PermissionDto
    ) {
        return this.permissionService.updatePermission(id, permissionDto);
    }

    @Delete(':id')
    @HasPermission('EDITAR_PERMISOS')
    async deletePermission(@Param('id', ParseIntPipe) id: number) {
        return this.permissionService.deletePermission(id);
    }

}