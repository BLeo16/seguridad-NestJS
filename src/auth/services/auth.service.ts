import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { RegistUserDTO } from '../dtos/RegistUserDto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const userWithRolesAndPermissions = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: { include: { permissions: true } },
      },
    });

    const roles = userWithRolesAndPermissions.roles.map(r => r.name);
    const permissions = userWithRolesAndPermissions.roles.flatMap(
      r => r.permissions.map(p => p.name),
    );

    const payload = {
      sub: userWithRolesAndPermissions.id,
      email: userWithRolesAndPermissions.email,
      roles,
      permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: RegistUserDTO) {
    const existingUser = await this.usersService.findOneByEmail(userDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Ya existe un usuario con este email');
    }
    const user = await this.usersService.createUser(
      userDto.email,
      userDto.password,
      userDto.name,
    );
    const { password, ...result } = user;
    return result;
  }
}
