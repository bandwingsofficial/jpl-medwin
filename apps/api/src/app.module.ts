import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { BrandModule } from './modules/brand/brand.module';
import { ProductModule } from './modules/product/product.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SavedAddressModule } from './modules/saved-address/saved-address.module';
import { CartModule } from './modules/cart/cart.module';
import { CheckoutSessionModule } from './modules/checkout-session/checkout-session.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { CoinsModule } from './modules/coins/coins.module';
import { CustomerModule } from './modules/customer/customer.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CollectionModule } from './modules/collection/collection.module';
import { BannerModule } from './modules/banner/banner.module';
import { SearchModule } from './modules/search/search.module';
import { ReturnModule } from './modules/return/return.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ShippingConfigurationModule } from './modules/shipping-configuration/shipping-configuration.module';

import { RedisModule } from './infrastructure/cache/redis.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    RedisModule,
    PrismaModule,
    AuthModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    ProfileModule,
    SavedAddressModule,
    CartModule,
    CheckoutSessionModule,
    OrderModule,
    PaymentModule,
    CouponModule,
    CoinsModule,
    CustomerModule,
    WishlistModule,
    CollectionModule,
    BannerModule,
    SearchModule,
    ReturnModule,
    DashboardModule,
    ShippingConfigurationModule,
  ],
})
export class AppModule {}
