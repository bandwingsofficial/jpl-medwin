import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { SearchRepository } from '../../domain/repositories/search.repository';

@Injectable()
export class AutocompleteSearchUseCase {
  constructor(
    @Inject(TOKENS.SEARCH_REPOSITORY)
    private readonly searchRepository: SearchRepository,
  ) {}

  async execute(query: string, limit = 10) {
    return {
      results: await this.searchRepository.autocomplete(query, limit),
    };
  }
}
