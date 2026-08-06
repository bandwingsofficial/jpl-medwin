import { IsOptional, IsString } from 'class-validator';

export class CompleteReturnDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
