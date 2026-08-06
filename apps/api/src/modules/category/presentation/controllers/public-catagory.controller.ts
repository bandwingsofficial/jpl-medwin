import { Controller, Get, Query } from '@nestjs/common';

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
    return this.getTree.execute(true); // only ACTIVE
  }

  @Get()
  getAll() {
    return this.getCategories.execute(true);
  }

  @Get('sub')
  getSubsAll(@Query('categoryId') categoryId?: string) {
    return this.getSubs.execute({ categoryId });
  }

  @Get('mini')
  getMinisAll(@Query('subCategoryId') subCategoryId?: string) {
    return this.getMinis.execute({ subCategoryId });
  }
}
