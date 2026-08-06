import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ProductType } from '../../domain/enums/product-type.enum';
import { CustomerType } from '../../domain/enums/customer-type.enum';

export class PreviewSkuVariantInput {
  @IsOptional()
  @IsString()
  tempId?: string;

  @IsOptional()
  @IsString()
  variantName?: string;
}

export class PreviewSkuDto {
  @IsString()
  brandId: string;

  @IsEnum(CustomerType)
  customerType: CustomerType;

  @IsEnum(ProductType)
  productType: ProductType;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeVariantIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreviewSkuVariantInput)
  variants?: PreviewSkuVariantInput[];
}
