import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';

import { SearchQueryDto } from '../../application/dtos/search-query.dto';
import { GlobalSearchUseCase } from '../../application/use-cases/global-search.use-case';
import { AutocompleteSearchUseCase } from '../../application/use-cases/autocomplete-search.use-case';

@Controller('admin/search')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class SearchController {
  constructor(
    private readonly globalSearchUseCase: GlobalSearchUseCase,
    private readonly autocompleteSearchUseCase : AutocompleteSearchUseCase
  ) {}

  @Get()
  async search(
    @Query() query: SearchQueryDto,
  ) {
    return this.globalSearchUseCase.execute(
      query.q,
      query.limit,
    );
  }

  @Get('autocomplete')
async autocomplete(
  @Query('q') query: string,
  @Query('limit') limit?: number,
) {
  return this.autocompleteSearchUseCase.execute(
    query,
    limit,
  );
}
}