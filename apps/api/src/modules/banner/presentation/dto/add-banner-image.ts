import { IsOptional, IsString, Min } from 'class-validator';

export class AddBannerImageDto {
  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @Min(0)
  sortOrder?: number;
}
