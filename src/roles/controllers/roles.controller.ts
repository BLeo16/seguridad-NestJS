import { Controller, Param, Get, Patch, Body, UseGuards, ParseIntPipe, Post, Delete } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PermissionGuard } from "src/auth/guards/permission.guard";
import { RolesService } from "../services/roles.service";
import { RoleDto } from "../dtos/role.dto";
import { UpdateRoleDto } from "../dtos/RoleUpdate.dto";
import { HasPermission } from "src/auth/decorators/has-permission.decorator";

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get(':id')
    @HasPermission('VER_ROLES')
    async getRoleById(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.findOneById(id);
    }
    @Get()
    @HasPermission('VER_ROLES')
    async getAllRoles (){
        return this.rolesService.findAll();
    }

    @Post()
    @HasPermission('EDITAR_ROLES')
    async createRole(@Body() roleDto: RoleDto) {
        return this.rolesService.createRole(roleDto);
    }

    @Patch(':id')
    @HasPermission('EDITAR_ROLES')
    async updateRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRole: UpdateRoleDto,
    ) {
        return this.rolesService.updateRole(id, updateRole);
    }

    @Delete(':id')
    @HasPermission('EDITAR_ROLES')
    async deleteRole(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.deleteRole(id);
    }
}