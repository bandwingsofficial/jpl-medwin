import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { SearchRepository } from '../../../../domain/repositories/search.repository';

import { SearchResult } from '../../../../application/types/search-result.type';

import { SearchResponseMapper } from '../mappers/search-response.mapper';

@Injectable()
export class PrismaSearchRepository implements SearchRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Converts a user search query into independent searchable tokens.
   *
   * Examples:
   * "mani bur"            -> ["mani", "bur"]
   * "k-files"             -> ["k", "files"]
   * "k files"             -> ["k", "files"]
   * "mani/k-files/bur"    -> ["mani", "k", "files", "bur"]
   */
  private tokenizeQuery(query: string): string[] {
    return query
      .trim()
      .toLowerCase()
      .split(/[\s,./\\|_+-]+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 0);
  }

  async search(query: string, limit = 5): Promise<SearchResult[]> {
    const tokens = this.tokenizeQuery(query);

    if (tokens.length === 0) {
      return [];
    }

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

          AND: tokens.map((token) => ({
            OR: [
              {
                name: {
                  contains: token,
                  mode: 'insensitive',
                },
              },
              {
                slug: {
                  contains: token,
                  mode: 'insensitive',
                },
              },
              {
                shortDescription: {
                  contains: token,
                  mode: 'insensitive',
                },
              },
              {
                longDescription: {
                  contains: token,
                  mode: 'insensitive',
                },
              },
            ],
          })),
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

          AND: tokens.map((token) => ({
            OR: [
              {
                name: {
                  contains: token,
                  mode: 'insensitive',
                },
              },
              {
                slug: {
                  contains: token,
                  mode: 'insensitive',
                },
              },
            ],
          })),
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

          AND: tokens.map((token) => ({
            OR: [
              {
                name: {
                  contains: token,
                  mode: 'insensitive',
                },
              },
              {
                slug: {
                  contains: token,
                  mode: 'insensitive',
                },
              },
            ],
          })),
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

          AND: tokens.map((token) => ({
            OR: [
              {
                name: {
                  contains: token,
                  mode: 'insensitive',
                },
              },
              {
                slug: {
                  contains: token,
                  mode: 'insensitive',
                },
              },
            ],
          })),
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

          AND: tokens.map((token) => ({
            OR: [
              {
                name: {
                  contains: token,
                  mode: 'insensitive',
                },
              },
              {
                slug: {
                  contains: token,
                  mode: 'insensitive',
                },
              },
            ],
          })),
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
      ...subCategories.map(SearchResponseMapper.fromSubCategory),
      ...miniCategories.map(SearchResponseMapper.fromMiniCategory),
    ];
  }

  async autocomplete(
    query: string,
    limit = 10,
  ): Promise<SearchResult[]> {
    return this.search(query, limit);
  }
}