import { IsString, IsOptional, MinLength, IsNotEmpty } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty() // 🔥 THIS WAS MISSING
  categoryId!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;
}
