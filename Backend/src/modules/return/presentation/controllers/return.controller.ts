import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { AuthRequest } from '@/modules/auth/types/auth-request.type';

import { RequestReturnUseCase } from '../../application/use-cases/request-return.use-case';

import { GetReturnUseCase } from '../../application/use-cases/get-return.use-case';

import { GetMyReturnsUseCase } from '../../application/use-cases/get-my-returns.use-case';

import { RequestReturnDto } from '../dto/request-return.dto';

@Controller('returns')
@UseGuards(JwtAuthGuard)
export class ReturnController {
  constructor(
    private readonly requestReturnUseCase: RequestReturnUseCase,

    private readonly getReturnUseCase: GetReturnUseCase,

    private readonly getMyReturnsUseCase: GetMyReturnsUseCase,
  ) {}

  // =======================
  // REQUEST RETURN
  // =======================

  @Post()
  async request(
    @Req() req: AuthRequest,

    @Body()
    body: RequestReturnDto,
  ) {
    const data =
      await this.requestReturnUseCase.execute({
        ...body,

        userId: req.user.userId,
      });

    return {
      message: 'Return requested successfully',

      ...data,
    };
  }

  // =======================
  // GET RETURN
  // =======================

  @Get(':returnId')
  async getReturn(
    @Req() req: AuthRequest,

    @Param('returnId')
    returnId: string,
  ) {
    const data =
      await this.getReturnUseCase.execute({
        returnId,

        userId: req.user.userId,
      });

    return {
      message: 'Return fetched successfully',

      ...data,
    };
  }

  // =======================
  // GET MY RETURNS
  // =======================

  @Get()
  async getMyReturns(
    @Req() req: AuthRequest,
  ) {
    const data =
      await this.getMyReturnsUseCase.execute({
        userId: req.user.userId,
      });

    return {
      message: 'Returns fetched successfully',

      ...data,
    };
  }
}