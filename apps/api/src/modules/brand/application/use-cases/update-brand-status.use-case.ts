import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { BrandRepository } from '../../domain/repositories/brand.repository';
import { BrandNotFoundException } from '../../domain/exceptions/brand-not-found.exception';
import { BrandStatus } from '../../domain/enums/brand-status.enum';

@Injectable()
export class UpdateBrandStatusUseCase {
  constructor(
    @Inject(TOKENS.BRAND_REPO)
    private readonly brandRepo: BrandRepository,
  ) {}

  async execute(input: { id: string; status: BrandStatus }) {
    const brand = await this.brandRepo.findById(input.id);

    if (!brand) {
      throw new BrandNotFoundException({ brandId: input.id });
    }

    if (input.status === BrandStatus.ACTIVE) {
      brand.activate();
    } else {
      brand.deactivate();
    }

    return this.brandRepo.update(brand);
  }
}
