// import { Injectable, Inject } from '@nestjs/common';
// import { TOKENS } from '@/common/constants/tokens';

// import { VariantRepository } from '../../domain/repositories/variant.repository';

// import { QuantityVO } from '../../domain/value-objects/quantity.vo';

// @Injectable()
// export class UpdateVariantStockUseCase {
//   constructor(
//     @Inject(TOKENS.VARIANT_REPO)
//     private readonly variantRepo: VariantRepository,
//   ) {}

//   async execute(variantId: string, quantity: number) {
//     const variant = await this.variantRepo.findById(variantId);

//     if (!variant || variant.isDeleted()) {
//       throw new Error('Variant not found');
//     }

//     // =======================
//     // 🔒 VALIDATE
//     // =======================
//     const normalizedQty = new QuantityVO(quantity).getValue();

//     // =======================
//     // 🧠 DOMAIN METHOD (IMPORTANT)
//     // =======================
//     variant.updateStock(normalizedQty); // ✅ FIX

//     return this.variantRepo.update(variant);
//   }
// }
