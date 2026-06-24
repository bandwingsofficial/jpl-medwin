import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { SearchRepository } from '../../domain/repositories/search.repository';

import { GlobalSearchDto } from '../dtos/global-search.dto';

import { SearchBuilderService } from '../services/search-builder.service';

import { InvalidSearchQueryException } from '../../domain/exceptions/invalid-search-query.exception';

@Injectable()
export class GlobalSearchUseCase {
  constructor(
    @Inject(TOKENS.SEARCH_REPOSITORY)
    private readonly searchRepository: SearchRepository,

    private readonly searchBuilderService: SearchBuilderService,
  ) {}

  async execute(
    query: string,
    limit = 10,
  ): Promise<GlobalSearchDto> {
    if (!query?.trim()) {
      throw new InvalidSearchQueryException();
    }

    const results = await this.searchRepository.search(
      query.trim(),
      limit,
    );

    return {
      results: this.searchBuilderService.build(
        results,
      ),
    };
  }
}