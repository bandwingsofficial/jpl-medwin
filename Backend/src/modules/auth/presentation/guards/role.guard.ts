import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthRequest } from '@/modules/auth/types/auth-request.type'; // ✅ FIX

import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@/domain/enums/user-role.enum';

import { ForbiddenRoleException } from '@/domain/exceptions/user/forbidden-role.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // =======================
    // ✅ No roles → allow
    // =======================
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>(); // ✅ FIX

    const user = request.user;

    // =======================
    // ❌ No user / role
    // =======================
    if (!user || !user.role) {
      throw new ForbiddenRoleException({
        requiredRoles,
      });
    }

    // =======================
    // ❌ Role mismatch
    // =======================
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenRoleException({
        requiredRoles,
        currentRole: user.role,
      });
    }

    return true;
  }
}
