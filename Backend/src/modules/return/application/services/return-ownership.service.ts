import { Injectable } from '@nestjs/common';

import { Return } from '../../domain/entities/return.entity';

@Injectable()
export class ReturnOwnershipService {
  canAccess(params: {
    returnRequest: Return;

    userId: string;
  }): boolean {
    return (
      params.returnRequest.userId ===
      params.userId
    );
  }
}