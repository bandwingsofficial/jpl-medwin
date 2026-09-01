import { IsEmail, IsIn, IsOptional, IsString, Matches } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsIn(['Dr', 'Mr', 'Ms', 'Mrs'], {
    message: 'Salutation must be Dr, Mr, Ms, or Mrs',
  })
  salutation?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['Dentist', 'Clinic', 'Hospital', 'Dealer', 'Other'], {
    message: 'Customer type must be Dentist, Clinic, Hospital, Dealer, or Other',
  })
  customerType?: string;

  @IsOptional()
  @IsString()
  clinicHospitalName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(\+?\d{10,15})$/, {
    message: 'Invalid WhatsApp number',
  })
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Zz][0-9A-Za-z]{1}$/, {
    message: 'Invalid GSTIN format',
  })
  gstNumber?: string;

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
