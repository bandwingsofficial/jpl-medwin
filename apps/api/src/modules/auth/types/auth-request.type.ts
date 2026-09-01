import { Request } from 'express';
import { UserRole } from '@/domain/enums/user-role.enum';

export interface AuthRequest extends Request {
  user: {
    userId: string;
    sessionId: string;
    role: UserRole;
  };
}
