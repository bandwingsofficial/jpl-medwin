import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  // ✅ Clean input allowed
  @IsOptional()
  @IsString()
  @Length(2, 120)
  slug?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  metaDescription?: string;
}
