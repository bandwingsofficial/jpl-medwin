// src/modules/saved-address/presentation/dto/create-saved-address.dto.ts

import {
  IsBoolean,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsPostalCode,
  IsString,
  MaxLength,
} from 'class-validator';

import { AddressType } from '../../domain/enums/address-type.enum';

export class CreateSavedAddressDto {
  // =======================
  // 🏷 TYPE
  // =======================

  @IsEnum(AddressType)
  type!: AddressType;


  

  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @IsString()
  @MaxLength(20)
  phoneNumber!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  alias?: string;

  // =======================
  // 📍 ADDRESS
  // =======================

  @IsString()
  @MaxLength(255)
  addressLine1!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  landmark?: string;

  @IsString()
  @MaxLength(100)
  city!: string;

  @IsString()
  @MaxLength(100)
  state!: string;

  @IsString()
  @MaxLength(100)
  country!: string;

  @IsString()
  @MaxLength(20)
  postalCode!: string;

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
