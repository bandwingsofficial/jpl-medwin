import {
  Banner as PrismaBanner,
  BannerStatus as PrismaBannerStatus,
  BannerType as PrismaBannerType,
} from '@prisma/client';

import { Banner } from '../../../../domain/entities/banner.entity';

import { BannerStatus } from '../../../../domain/enums/banner-status.enum';
import { BannerType } from '../../../../domain/enums/banner-type.enum';

import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class BannerMapper {
  // =======================
  // 🔄 STATUS
  // =======================

  private static toDomainStatus(
    status: PrismaBannerStatus,
  ): BannerStatus {
    switch (status) {
      case PrismaBannerStatus.ACTIVE:
        return BannerStatus.ACTIVE;

      case PrismaBannerStatus.INACTIVE:
        return BannerStatus.INACTIVE;

      default:
        throw new InvalidEnumMappingException({
          enumName:
            'Unknown PrismaBannerStatus',

          value: status,

          direction: 'prisma_to_domain',
        });
    }
  }

  private static toPrismaStatus(
    status: BannerStatus,
  ): PrismaBannerStatus {
    switch (status) {
      case BannerStatus.ACTIVE:
        return PrismaBannerStatus.ACTIVE;

      case BannerStatus.INACTIVE:
        return PrismaBannerStatus.INACTIVE;

      default:
        throw new InvalidEnumMappingException({
          enumName:
            'Unknown BannerStatus',

          value: status,

          direction: 'domain_to_prisma',
        });
    }
  }

  // =======================
  // 🔄 TYPE
  // =======================

  private static toDomainType(
    type: PrismaBannerType,
  ): BannerType {
    switch (type) {
      case PrismaBannerType.HOME_BANNER:
        return BannerType.HOME_BANNER;

      case PrismaBannerType.CATEGORY_BANNER:
        return BannerType.CATEGORY_BANNER;

      case PrismaBannerType.SUB_CATEGORY_BANNER:
        return BannerType.SUB_CATEGORY_BANNER;

      case PrismaBannerType.PROMOTIONAL_BANNER:
        return BannerType.PROMOTIONAL_BANNER;

      case PrismaBannerType.PRODUCT_BANNER:
        return BannerType.PRODUCT_BANNER;

      default:
        throw new InvalidEnumMappingException({
          enumName:
            'Unknown PrismaBannerType',

          value: type,

          direction: 'prisma_to_domain',
        });
    }
  }

  private static toPrismaType(
    type: BannerType,
  ): PrismaBannerType {
    switch (type) {
      case BannerType.HOME_BANNER:
        return PrismaBannerType.HOME_BANNER;

      case BannerType.CATEGORY_BANNER:
        return PrismaBannerType.CATEGORY_BANNER;

      case BannerType.SUB_CATEGORY_BANNER:
        return PrismaBannerType.SUB_CATEGORY_BANNER;

      case BannerType.PROMOTIONAL_BANNER:
        return PrismaBannerType.PROMOTIONAL_BANNER;

      case BannerType.PRODUCT_BANNER:
        return PrismaBannerType.PRODUCT_BANNER;

      default:
        throw new InvalidEnumMappingException({
          enumName:
            'Unknown BannerType',

          value: type,

          direction: 'domain_to_prisma',
        });
    }
  }

  // =======================
  // 📦 BANNER
  // =======================

  static toDomain(
    p: PrismaBanner,
  ): Banner {
    return new Banner(
      p.id,

      p.name,

      this.toDomainType(p.type),

      this.toDomainStatus(p.status),

      p.createdAt,

      p.updatedAt,

      p.deletedAt ?? undefined,
    );
  }

  static toPersistence(
    e: Banner,
  ) {
    return {
      id: e.id,

      name: e.name,

      type: this.toPrismaType(
        e.type,
      ),

      status: this.toPrismaStatus(
        e.status,
      ),

      createdAt: e.createdAt,

      updatedAt: e.updatedAt,

      deletedAt: e.deletedAt ?? null,
    };
  }
}