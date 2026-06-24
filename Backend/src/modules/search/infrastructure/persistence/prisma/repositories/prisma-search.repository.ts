import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { SearchRepository } from '../../../../domain/repositories/search.repository';

import { SearchResult } from '../../../../application/types/search-result.type';

import { SearchResponseMapper } from '../mappers/search-response.mapper';

@Injectable()
export class PrismaSearchRepository implements SearchRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async search(
    query: string,
    limit = 5,
  ): Promise<SearchResult[]> {
    const [
      products,
      brands,
      categories,
      subCategories,
      miniCategories,
    ] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          deletedAt: null,

          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              slug: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              shortDescription: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              longDescription: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },

        select: {
          id: true,
          name: true,
          slug: true,
        },

        take: limit,
      }),

      this.prisma.brand.findMany({
        where: {
          deletedAt: null,

          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              slug: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },

        select: {
          id: true,
          name: true,
          slug: true,
        },

        take: limit,
      }),

      this.prisma.category.findMany({
        where: {
          deletedAt: null,

          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              slug: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },

        select: {
          id: true,
          name: true,
          slug: true,
        },

        take: limit,
      }),

      this.prisma.subCategory.findMany({
        where: {
          deletedAt: null,

          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              slug: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },

        select: {
          id: true,
          name: true,
          slug: true,
        },

        take: limit,
      }),

      this.prisma.miniCategory.findMany({
        where: {
          deletedAt: null,

          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              slug: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },

        select: {
          id: true,
          name: true,
          slug: true,
        },

        take: limit,
      }),
    ]);

    return [
      ...products.map(SearchResponseMapper.fromProduct),
      ...brands.map(SearchResponseMapper.fromBrand),
      ...categories.map(SearchResponseMapper.fromCategory),
      ...subCategories.map(
        SearchResponseMapper.fromSubCategory,
      ),
      ...miniCategories.map(
        SearchResponseMapper.fromMiniCategory,
      ),
    ];
  }
  async autocomplete(
  query: string,
  limit = 10,
): Promise<SearchResult[]> {
  return this.search(query, limit);
}
}