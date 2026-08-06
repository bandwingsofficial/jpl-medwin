/**
 * Create order request body.
 *
 * @example
 * {
 *   "checkoutSessionId": "4d68c2f4-eefe-43d1-aaa8-2527e90c805e",
 *   "shippingAddressId": "saved-address-id-1",
 *   "billingAddressId": "saved-address-id-2",
 *   "isBillingSameAsShipping": false,
 *   "customerNote": "Handle carefully"
 * }
 *
 * @example Same billing as shipping
 * {
 *   "checkoutSessionId": "4d68c2f4-eefe-43d1-aaa8-2527e90c805e",
 *   "shippingAddressId": "addr1",
 *   "isBillingSameAsShipping": true
 * }
 */
import { IsBoolean, IsOptional, IsString } from 'class-validator';

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
  customerNote?: string;
}
