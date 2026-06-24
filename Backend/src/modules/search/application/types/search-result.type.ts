import { SearchType } from '../../domain/enums/search-type.enum';

export type SearchResult = {
  id: string;
  name: string;
  slug: string;
  type: SearchType;
};