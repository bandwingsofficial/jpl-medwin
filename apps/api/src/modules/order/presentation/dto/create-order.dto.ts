import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  checkoutSessionId: string;

  @IsString()
  shippingAddressId: string;

  @IsOptional()
  @IsString()
  billingAddressId?: string;

  @IsOptional()
  @IsBoolean()
  isBillingSameAsShipping?: boolean;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() ? value.trim() : undefined,
  )
  customerNote?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() ? value.trim().toUpperCase() : undefined,
  )
  @ValidateIf((o) => typeof o.gstNumber === 'string' && o.gstNumber.trim().length > 0)
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: 'Please enter a valid GST number.',
  })
  gstNumber?: string;

  @IsIn([
    'RAZORPAY',
    'UPI',
    'COD',
  ])
  paymentMethod:
    | 'RAZORPAY'
    | 'UPI'
    | 'COD';
}