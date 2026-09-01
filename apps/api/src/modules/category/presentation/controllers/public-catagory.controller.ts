import { Controller, Get, Param } from '@nestjs/common';

import { GetCategoryTreeUseCase } from '../../../category/application/usecases/get-category-tree.usecase';
import { GetCategoriesUseCase } from '../../application/usecases/category/get-categories.usecase';
import { GetSubCategoriesUseCase } from '../../application/usecases/sub-category/get-sub-categories.usecase';
import { GetMiniCategoriesUseCase } from '../../application/usecases/mini-category/get-mini-categories.usecase';

@Controller('categories')
export class PublicCategoryController {
  constructor(
    private readonly getTree: GetCategoryTreeUseCase,
    private readonly getCategories: GetCategoriesUseCase,
    private readonly getSubs: GetSubCategoriesUseCase,
    private readonly getMinis: GetMiniCategoriesUseCase,
  ) {}

  @Get('tree')
  getCategoryTree() {
    return this.getTree.execute(true);
  }

  @Get()
  getAll() {
    return this.getCategories.execute(true);
  }

  @Get(':categorySlug/sub')
  getSubsAll(
    @Param('categorySlug') categorySlug: string,
  ) {
    return this.getSubs.execute({
      categorySlug,
      onlyActive: true,
    });
  }

  @Get(':categorySlug/sub/:subCategorySlug/mini')
  getMinisAll(
    @Param('categorySlug') categorySlug: string,
    @Param('subCategorySlug') subCategorySlug: string,
  ) {
    return this.getMinis.execute({
      categorySlug,
      subCategorySlug,
      onlyActive: true,
    });
  }
}