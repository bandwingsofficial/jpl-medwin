import { IsString, Length, IsOptional } from 'class-validator';

export class AdminVerifyEmailOtpDto {
  @IsString()
  challengeId!: string;

  @IsString()
  @Length(6, 6)
  otp!: string;
}

export class AdminResendEmailOtpDto {
  @IsString()
  challengeId!: string;
}

export class AdminVerifyTotpDto {
  @IsString()
  challengeId!: string;

  @IsString()
  @Length(6, 6)
  totpCode!: string;

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
