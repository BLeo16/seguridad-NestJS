import { Controller, Param, Get, ParseIntPipe, Patch, Body, UseGuards, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { HasPermission } from 'src/auth/decorators/has-permission.decorator';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { UserStatus } from '@prisma/client';


@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @HasPermission('VER_USUARIOS')
    @Get()
    async getAllUsers(
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
        @Query('searchEmail') searchEmail?: string,
    ) {
        return this.usersService.findAll(page, limit, searchEmail);
    }

    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOneById(id);
    }

    @HasPermission('VER_USUARIOS')
    @Get('email/:email')
    async getUserByEmail(@Param('email') email: string) {
        return this.usersService.findOneByEmail(email);
    }

    @Patch(':id/roles')
    @HasPermission('EDITAR_USUARIOS')
    async updateUserRoles(
        @Param('id', ParseIntPipe) id: number,
        @Body('roles') roles: string[]
    ) {
        return this.usersService.updateUserRoles(id, roles);
    }

    @Patch(':id/status')
    @HasPermission('EDITAR_USUARIOS')
    async updateUserStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: UserStatus
    ) {
        return this.usersService.updateUserStatus(id, status);
    }

}
