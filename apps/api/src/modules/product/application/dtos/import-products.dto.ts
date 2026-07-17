import { IsEnum, IsOptional } from 'class-validator';

export enum ImportMode {
  SKIP = 'skip',
  OVERRIDE = 'override',
  RESTORE = 'restore',
}

export class ImportProductsDto {
  @IsOptional()
  @IsEnum(ImportMode)
  mode?: ImportMode = ImportMode.SKIP;
}
