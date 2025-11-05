import { Controller, Param, Get, ParseIntPipe, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOneById(id);
    }

    @Get('email/:email')
    async getUserByEmail(@Param('email') email: string) {
        return this.usersService.findOneByEmail(email);
    }

    @Patch(':id/roles')
    async updateUserRoles(
        @Param('id', ParseIntPipe) id: number,
        @Body('roles') roles: string[]
    ) {
        return this.usersService.updateUserRoles(id, roles);
    }

}
