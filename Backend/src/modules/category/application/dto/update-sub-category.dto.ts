import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateSubCategoryDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  metaDescription?: string;
}
