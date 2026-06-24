import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsArray,
  IsNumber,
  IsBoolean,
  IsEnum,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

import { ProductType } from '../../domain/enums/product-type.enum';

// =======================
// 🔧 SAFE PARSER
// =======================

function safeParse(value: any) {
  if (typeof value !== 'string') return value;

  try {
    const parsed = JSON.parse(value);

    // 🔥 handle double-string case
    if (typeof parsed === 'string') {
      try {
        return JSON.parse(parsed);
      } catch {
        return parsed;
      }
    }

    return parsed;
  } catch {
    return value; // ✅ FIX (NOT undefined)
  }
}

// =======================
// VARIANT UPDATE
// =======================

export class UpdateVariantDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  purchasePrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sellingPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  mrp?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @Transform(({ value }) => safeParse(value))
  attributes?: Record<string, any>;

  @IsOptional()
  mainImage?: string;

  // 🔥🔥🔥 ADD THIS
  @IsOptional()
  @Transform(({ value }) => safeParse(value))
  @ValidateNested({ each: true })
  @Type(() => UpdateProductImageDto)
  images?: UpdateProductImageDto[];
}

// =======================
// IMAGE UPDATE
// =======================

export class UpdateProductImageDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}

// =======================
// PRODUCT UPDATE
// =======================

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  slug?: string;

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  longDescription?: string;

  // =======================
  // 🔥 ARRAYS
  // =======================

  @IsOptional()
  @Transform(({ value }) => safeParse(value))
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  mainImage?: string;

  @IsOptional()
  @Transform(({ value }) => safeParse(value))
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @Transform(({ value }) => safeParse(value))
  @IsArray()
  @IsString({ each: true })
  displayNotes?: string[];

  // =======================
  // ⚙️ OBJECTS
  // =======================

  @IsOptional()
  @Transform(({ value }) => safeParse(value))
  specifications?: Record<string, any>;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isWeighted?: boolean;

  @IsOptional()
  @IsString()
  warranty?: string;

  // =======================
  // 🔥 VARIANTS
  // =======================

  @IsOptional()
  @Transform(({ value }) => safeParse(value))
  @ValidateNested({ each: true })
  @Type(() => UpdateVariantDto)
  variants?: UpdateVariantDto[];

  // =======================
  // 🔥 IMAGES
  // =======================

  @IsOptional()
  @Transform(({ value }) => safeParse(value))
  @ValidateNested({ each: true })
  @Type(() => UpdateProductImageDto)
  images?: UpdateProductImageDto[];
}
