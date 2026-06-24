// src/modules/saved-address/presentation/dto/update-saved-address.dto.ts

import {
  IsBoolean,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { AddressType } from '../../domain/enums/address-type.enum';

export class UpdateSavedAddressDto {
  // =======================
  // 🏷 TYPE
  // =======================

  @IsOptional()
  @IsEnum(AddressType)
  type?: AddressType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;
  
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  alias?: string;

  // =======================
  // 📍 ADDRESS
  // =======================

  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  landmark?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  // =======================
  // 🌍 GEO
  // =======================

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  // =======================
  // 🚚 FLAGS
  // =======================

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
