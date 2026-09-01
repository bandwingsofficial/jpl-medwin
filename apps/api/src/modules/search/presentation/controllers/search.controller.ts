// src/modules/search/presentation/controllers/search.controller.ts

import { Controller, Get, Query } from '@nestjs/common';

import { SearchQueryDto } from '../../application/dtos/search-query.dto';
import { GlobalSearchUseCase } from '../../application/use-cases/global-search.use-case';

@Controller('search')
export class SearchController {
  constructor(private readonly globalSearchUseCase: GlobalSearchUseCase) {}

  @Get()
  async search(@Query() query: SearchQueryDto) {
    return this.globalSearchUseCase.execute(query.q, query.limit);
  }
}
