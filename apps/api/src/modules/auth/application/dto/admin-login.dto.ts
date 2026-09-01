import { IsEmail, IsString, MinLength, IsOptional, Length } from 'class-validator';

export class AdminLoginDto {
  // =======================
  // 🔐 CREDENTIALS
  // =======================

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  // =======================
  // 🔐 TOTP
  // =======================

  @IsString()
  @Length(6, 6)
  totpCode!: string;

  // =======================
  // 📱 DEVICE
  // =======================

  @IsString()
  deviceId!: string;

  @IsOptional()
  @IsString()
  deviceName?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
