import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class SubscribeStockNotificationDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'WhatsApp number is required' })
  @Matches(/^[0-9+\-\s()]{7,20}$/, {
    message: 'Please enter a valid phone/WhatsApp number',
  })
  whatsappNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: string;

  @IsString()
  @IsOptional()
  variantId?: string;
}
