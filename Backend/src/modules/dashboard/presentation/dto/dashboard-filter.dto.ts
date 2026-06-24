import {
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';

import { Transform } from 'class-transformer';

import { DashboardPeriod } from '../../domain/enums/dashboard-period.enum';

export class DashboardFilterDto {
  @IsOptional()
  @IsEnum(DashboardPeriod)
  @Transform(({ value }) =>
    value?.toLowerCase(),
  )
  period?: DashboardPeriod =
    DashboardPeriod.OVERALL;

  @IsOptional()
  @Transform(({ value }) =>
    value?.trim(),
  )
  @IsDateString()
  from?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value?.trim(),
  )
  @IsDateString()
  to?: string;
}