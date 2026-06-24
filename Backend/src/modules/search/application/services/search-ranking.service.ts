import { Injectable } from '@nestjs/common';

import { SearchResult } from '../types/search-result.type';

@Injectable()
export class SearchRankingService {
  rank(
    results: SearchResult[],
  ): SearchResult[] {
    return results.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }
}