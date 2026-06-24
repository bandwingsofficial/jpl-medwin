import { IsOptional, IsString } from 'class-validator';

export class ApproveReturnDto {
  @IsOptional()
  @IsString()
  adminRemark?: string;
}