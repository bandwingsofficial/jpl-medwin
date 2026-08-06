import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateBannerImageDto {
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
