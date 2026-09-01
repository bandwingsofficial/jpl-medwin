import { SearchType } from '../../domain/enums/search-type.enum';

export class SearchItemDto {
  id!: string;

  name!: string;

  slug!: string;

  type!: SearchType;
}
