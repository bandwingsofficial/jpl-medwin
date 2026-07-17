import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ReturnReason } from '../../domain/enums/return-reason.enum';

import { ReturnType } from '../../domain/enums/return-type.enum';

export class RequestReturnDto {
  @IsString()
  orderId!: string;

  @IsEnum(ReturnType)
  type!: ReturnType;

  @IsEnum(ReturnReason)
  reason!: ReturnReason;

  @IsOptional()
  @IsString()
  description?: string;
}
