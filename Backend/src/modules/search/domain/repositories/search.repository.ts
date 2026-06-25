import { SearchResult } from '../../application/types/search-result.type';

export interface SearchRepository {
  search(query: string, limit?: number): Promise<SearchResult[]>;

  autocomplete(query: string, limit?: number): Promise<SearchResult[]>;
}
