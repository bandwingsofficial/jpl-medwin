import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { BrandRepository } from '../../domain/repositories/brand.repository';
import { Brand } from '../../domain/entities/brand.entity';

@Injectable()
export class GetBrandsUseCase {
  constructor(
    @Inject(TOKENS.BRAND_REPO)
    private readonly brandRepo: BrandRepository,
  ) {}

  async execute(): Promise<Brand[]> {
    const brands = await this.brandRepo.findAll();

    // 🔒 defensive filter (future-proof)
    return brands.filter((b) => !b.isDeleted?.());
  }
}
