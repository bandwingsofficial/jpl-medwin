import { Brand as PrismaBrand, BrandStatus as PrismaBrandStatus } from '@prisma/client';

import { Brand } from '../../../../domain/entities/brand.entity';
import { BrandStatus } from '../../../../domain/enums/brand-status.enum';
import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class BrandMapper {
  // =======================
  // 🔄 ENUM MAPPING
  // =======================

  private static toDomainStatus(status: PrismaBrandStatus): BrandStatus {
    switch (status) {
      case PrismaBrandStatus.ACTIVE:
        return BrandStatus.ACTIVE;
      case PrismaBrandStatus.INACTIVE:
        return BrandStatus.INACTIVE;
      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Prisma status', value: status, direction: 'prisma_to_domain' });
    }
  }

  private static toPrismaStatus(status: BrandStatus): PrismaBrandStatus {
    switch (status) {
      case BrandStatus.ACTIVE:
        return PrismaBrandStatus.ACTIVE;
      case BrandStatus.INACTIVE:
        return PrismaBrandStatus.INACTIVE;
      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Domain status', value: status, direction: 'domain_to_prisma' });
    }
  }

  // =======================
  // 🟦 BRAND
  // =======================

  static toDomain(p: PrismaBrand): Brand {
    return new Brand(
      p.id,
      p.name,
      p.slug,
      p.imageUrl ?? undefined,
      p.description ?? undefined,
      p.metaDescription ?? undefined,
      this.toDomainStatus(p.status),
      p.createdAt,
      p.updatedAt,
      p.deletedAt ?? undefined,
    );
  }

  static toPersistence(e: Brand) {
    return {
      id: e.id,
      name: e.name,
      slug: e.slug,
      imageUrl: e.imageUrl ?? null,
      description: e.description ?? null,
      metaDescription: e.metaDescription ?? null,
      status: this.toPrismaStatus(e.status),
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      deletedAt: e.deletedAt ?? null,
    };
  }
}
