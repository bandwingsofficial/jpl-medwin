import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';

import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';

import { GetReturnUseCase } from '../../application/use-cases/get-return.use-case';

import { GetMyReturnsUseCase } from '../../application/use-cases/get-my-returns.use-case';

import { ApproveReturnUseCase } from '../../application/use-cases/approve-return.use-case';

import { RejectReturnUseCase } from '../../application/use-cases/reject-return.use-case';

import { PickupReturnUseCase } from '../../application/use-cases/pickup-return.use-case';

import { CompleteReturnUseCase } from '../../application/use-cases/complete-return.use-case';

import { ApproveReturnDto } from '../dto/approve-return.dto';

import { RejectReturnDto } from '../dto/reject-return.dto';

import { PickupReturnDto } from '../dto/pickup-return.dto';

import { CompleteReturnDto } from '../dto/complete-return.dto';

@Controller('admin/returns')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminReturnController {
  constructor(
    private readonly getReturnUseCase: GetReturnUseCase,

    private readonly getMyReturnsUseCase: GetMyReturnsUseCase,

    private readonly approveReturnUseCase: ApproveReturnUseCase,

    private readonly rejectReturnUseCase: RejectReturnUseCase,

    private readonly pickupReturnUseCase: PickupReturnUseCase,

    private readonly completeReturnUseCase: CompleteReturnUseCase,
  ) {}

 @Get()
async getReturns(
 @Query() query: any,
) {
 const data =
   await this.getMyReturnsUseCase.execute({
     ...query,

     page: query.page
       ? Number(query.page)
       : 1,

     limit: query.limit
       ? Number(query.limit)
       : 10,
   });

 return {
   message: 'Returns fetched successfully',

   ...data,
 };
}


  @Get(':returnId')
  async getReturn(
    @Param('returnId')
    returnId: string,
  ) {
    const data =
      await this.getReturnUseCase.execute({
        returnId,

        isAdmin: true,

        userId: '',
      });

    return {
      message: 'Return fetched successfully',

      ...data,
    };
  }

  // =======================
  // APPROVE
  // =======================

 @Post(':returnId/approve')
async approve(
  @Param('returnId')
  returnId: string,

  @Body()
  body: ApproveReturnDto,
) {
  const data =
    await this.approveReturnUseCase.execute({
      returnId,
      adminRemark: body.adminRemark,
    });

  return {
    message: 'Return approved successfully',
    ...data,
  };
}

  // =======================
  // REJECT
  // =======================

  @Post(':returnId/reject')
  async reject(
    @Param('returnId')
    returnId: string,

    @Body()
    body: RejectReturnDto,
  ) {
    const data =
      await this.rejectReturnUseCase.execute({
        returnId,

        reason: body.reason,
      });

    return {
      message: 'Return rejected successfully',

      ...data,
    };
  }

  // =======================
  // PICKUP
  // =======================

  @Post(':returnId/pickup')
  async pickup(
    @Param('returnId')
    returnId: string,

    @Body()
    body: PickupReturnDto,
  ) {
    const data =
      await this.pickupReturnUseCase.execute({
        returnId,

        trackingId: body.trackingId,
      });

    return {
      message: 'Return picked up successfully',

      ...data,
    };
  }

  // =======================
  // COMPLETE
  // =======================

  @Post(':returnId/complete')
  async complete(
    @Param('returnId')
    returnId: string,

    @Body()
    body: CompleteReturnDto,
  ) {
    const data =
      await this.completeReturnUseCase.execute({
        returnId,

        reason: body.reason,
      });

    return {
      message: 'Return completed successfully',

      ...data,
    };
  }
}