import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class ForbiddenRoleException extends BaseException {
  constructor(details?: { requiredRoles?: string[]; currentRole?: string }) {
    super(
      'You do not have permission to access this resource',
      ErrorCode.AUTH.FORBIDDEN_ROLE,
      HttpStatus.FORBIDDEN,
      {
        ...details,
        fields: {
          role: `Required: ${details?.requiredRoles?.join(', ')}, but got: ${details?.currentRole}`,
        },
      },
    );
  }
}
