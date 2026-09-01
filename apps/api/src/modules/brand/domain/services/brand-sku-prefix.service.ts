import { Inject, Injectable, HttpStatus } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

import { BrandRepository } from '../repositories/brand.repository';
import { BrandSkuPrefixVO } from '../value-objects/brand-sku-prefix.vo';

@Injectable()
export class BrandSkuPrefixService {
  constructor(
    @Inject(TOKENS.BRAND_REPO)
    private readonly brandRepo: BrandRepository,
  ) {}

  suggestCandidatesFromName(name: string): string[] {
    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const clean = (value: string) => value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    const candidates: string[] = [];

    if (words.length >= 1) {
      const first = clean(words[0]);

      if (first.length >= 2) {
        candidates.push(first.slice(0, 3));
        candidates.push(first.slice(0, 4));
        candidates.push(first.slice(0, 6));
      }
    }

    if (words.length >= 2) {
      const acronym = words
        .map((word) => clean(word)[0])
        .filter(Boolean)
        .join('');

      if (acronym.length >= 2) {
        candidates.push(acronym.slice(0, 6));
      }

      const second = clean(words[1]);

      if (second.length >= 2) {
        const hybrid = `${clean(words[0])[0] || ''}${second[0] || ''}${second[1] || ''}`;

        if (hybrid.length >= 2) {
          candidates.push(hybrid.slice(0, 6));
        }
      }
    }

    return [...new Set(candidates)].filter(
      (candidate) => candidate.length >= 2 && candidate.length <= 6,
    );
  }

  normalizePrefix(input: string): string {
    return new BrandSkuPrefixVO(input).getValue();
  }

  async isTaken(prefix: string, excludeId?: string): Promise<boolean> {
    const existing = await this.brandRepo.findBySkuPrefix(prefix);

    if (!existing) {
      return false;
    }

    if (excludeId && existing.id === excludeId) {
      return false;
    }

    return true;
  }

  async resolveUniquePrefix(name: string, excludeId?: string): Promise<string> {
    const candidates = this.suggestCandidatesFromName(name);

    for (const candidate of candidates) {
      if (!(await this.isTaken(candidate, excludeId))) {
        return candidate;
      }
    }

    const base = candidates[0] || 'BR';

    for (let counter = 1; counter <= 99; counter += 1) {
      const suffix = String(counter);
      const trimmed = base.slice(0, Math.max(2, 6 - suffix.length));
      const candidate = `${trimmed}${suffix}`;

      if (!(await this.isTaken(candidate, excludeId))) {
        return candidate;
      }
    }

    throw new BaseException(
      'Unable to generate unique SKU prefix',
      ErrorCode.BRAND.INVALID,
      HttpStatus.BAD_REQUEST,
    );
  }

  async resolveNextAvailablePrefix(prefix: string, excludeId?: string): Promise<string> {
    const normalized = this.normalizePrefix(prefix);

    if (!(await this.isTaken(normalized, excludeId))) {
      return normalized;
    }

    for (let counter = 1; counter <= 99; counter += 1) {
      const suffix = String(counter);
      const trimmed = normalized.slice(0, Math.max(2, 6 - suffix.length));
      const candidate = `${trimmed}${suffix}`;

      if (!(await this.isTaken(candidate, excludeId))) {
        return candidate;
      }
    }

    throw new BaseException(
      'Unable to generate unique SKU prefix',
      ErrorCode.BRAND.INVALID,
      HttpStatus.BAD_REQUEST,
    );
  }
}
