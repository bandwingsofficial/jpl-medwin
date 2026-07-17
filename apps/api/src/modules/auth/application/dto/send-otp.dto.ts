import { IsOptional, IsString, ValidateIf, IsEnum } from 'class-validator';

import { OtpPurpose } from '@/domain/enums/otp-purpose.enum';

export class SendOtpDto {
  // =======================
  // IDENTIFIER
  // =======================

  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.email) // 🔥 require if email not present
  phone?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.phone) // 🔥 require if phone not present
  email?: string;

  // =======================
  // PURPOSE (OPTIONAL)
  // =======================

  @IsOptional()
  @IsEnum(OtpPurpose)
  purpose?: OtpPurpose;
}
