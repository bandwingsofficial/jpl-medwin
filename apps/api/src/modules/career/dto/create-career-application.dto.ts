import {
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCareerApplicationDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9+\-\s()]{7,20}$/, {
    message: 'mobileNumber must be a valid phone number',
  })
  mobileNumber!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  appliedPosition!: string;
}