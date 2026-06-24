// src/modules/profile/application/dto/update-profile.dto.ts

import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(\+?\d{10,15})$/, {
    message: 'Invalid phone number',
  })
  phoneNumber?: string;
}