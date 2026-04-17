import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { AuthRole } from './dto/login.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<AuthRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) as AuthRole[] | undefined;
    if (!roles || roles.length === 0) return true;
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role: AuthRole } }>();
    const user = request.user;
    if (!user) throw new UnauthorizedException();
    return roles.includes(user.role);
  }
}
