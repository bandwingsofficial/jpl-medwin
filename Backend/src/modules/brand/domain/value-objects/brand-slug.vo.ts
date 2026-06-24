import { SlugVO } from '../../../category/domain/value-objects/slug.vo';

export class BrandSlugVO {
  private readonly value: SlugVO;

  constructor(input: string) {
    this.value = new SlugVO(input);
  }

  // =======================
  // 📦 ACCESS
  // =======================

  getValue(): string {
    return this.value.getValue();
  }

  equals(other: BrandSlugVO): boolean {
    return this.value.equals(other.value);
  }

  toString(): string {
    return this.value.toString();
  }
}
