import { Injectable } from '@nestjs/common';

import { SearchResult } from '../types/search-result.type';
import { SearchRankingService } from './search-ranking.service';

@Injectable()
export class SearchBuilderService {
  constructor(
    private readonly searchRankingService: SearchRankingService,
  ) {}

  build(
    results: SearchResult[],
  ): SearchResult[] {
    return this.searchRankingService.rank(results);
  }
}