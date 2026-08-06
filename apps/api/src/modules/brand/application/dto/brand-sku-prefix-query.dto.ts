import { IsOptional, IsString } from 'class-validator';

export class CheckBrandSkuPrefixQueryDto {
  @IsString()
  prefix!: string;

  @IsOptional()
  @IsString()
  excludeId?: string;
}

export class SuggestBrandSkuPrefixQueryDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  excludeId?: string;
}
