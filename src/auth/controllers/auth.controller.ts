import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RegistUserDTO } from '../dtos/RegistUserDto';
import { UserWithoutPassword } from '../dtos/interfaces/User.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // Registro
  @Post('register')
  async register(@Body() userDto: RegistUserDTO) {
    return this.authService.register(userDto);
  }

  // Login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Request & { user: UserWithoutPassword }) {
    return this.authService.login(req.user);
  }
}
