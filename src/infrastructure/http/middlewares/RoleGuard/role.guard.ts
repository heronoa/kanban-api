import { AuthResponseDto } from '@/domain/dto/auth/auth-reponse.dto';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthResponseDto>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Acess Denied');
    }

    const hasRole = requiredRoles.includes(user.role);

    console.log({ requiredRoles, user });

    if (!hasRole) {
      throw new ForbiddenException('Insufficient permission');
    }

    return true;
  }
}
