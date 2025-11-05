import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/has-permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.permissions) {
      throw new ForbiddenException('Usuario sin permisos.');
    }

    // Verifica si el usuario tiene al menos uno de los permisos requeridos
    const hasPermission = user.permissions.some((p: string) =>
      requiredPermissions.includes(p),
    );

    if (!hasPermission) {
      throw new ForbiddenException('No tiene permisos suficientes.');
    }

    return true;
  }
}
