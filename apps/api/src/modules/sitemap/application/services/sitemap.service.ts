import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

interface SitemapUrl {
  loc: string;
  changefreq:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority: number;
}

@Injectable()
export class SitemapService {
  private readonly baseUrl = 'https://jplmedwin.com';

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async generate(): Promise<string> {
    const [
      products,
      categories,
      subCategories,
      collections,
    ] = await Promise.all([
      this.getProducts(),
      this.getCategories(),
      this.getSubCategories(),
      this.getCollections(),
    ]);

    const urls: SitemapUrl[] = [
      // =========================================================
      // HOME
      // =========================================================
      {
        loc: this.baseUrl,
        changefreq: 'daily',
        priority: 1,
      },

      // =========================================================
      // MAIN PUBLIC PAGES
      // =========================================================
      {
        loc: `${this.baseUrl}/about`,
        changefreq: 'monthly',
        priority: 0.8,
      },
      {
        loc: `${this.baseUrl}/brands`,
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        loc: `${this.baseUrl}/categories`,
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        loc: `${this.baseUrl}/collections`,
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: `${this.baseUrl}/Best-Seller`,
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: `${this.baseUrl}/bulk-contact`,
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        loc: `${this.baseUrl}/careers`,
        changefreq: 'monthly',
        priority: 0.6,
      },
      {
        loc: `${this.baseUrl}/events`,
        changefreq: 'monthly',
        priority: 0.6,
      },
      {
        loc: `${this.baseUrl}/contact-us`,
        changefreq: 'monthly',
        priority: 0.7,
      },

      // =========================================================
      // LEGAL / POLICY
      // =========================================================
      {
        loc: `${this.baseUrl}/privacy-policy`,
        changefreq: 'yearly',
        priority: 0.4,
      },
      {
        loc: `${this.baseUrl}/terms-of-use`,
        changefreq: 'yearly',
        priority: 0.4,
      },
      {
        loc: `${this.baseUrl}/disclaimer`,
        changefreq: 'yearly',
        priority: 0.4,
      },
      {
        loc: `${this.baseUrl}/shipping-policy`,
        changefreq: 'yearly',
        priority: 0.4,
      },
      {
        loc: `${this.baseUrl}/refund-policy`,
        changefreq: 'yearly',
        priority: 0.4,
      },
      {
        loc: `${this.baseUrl}/return-policy`,
        changefreq: 'yearly',
        priority: 0.4,
      },

      // =========================================================
      // PRODUCTS LIST
      // =========================================================
      {
        loc: `${this.baseUrl}/products`,
        changefreq: 'daily',
        priority: 1,
      },

      // =========================================================
      // DYNAMIC PRODUCT URLS
      // =========================================================
      ...products.map((product) => ({
        loc: `${this.baseUrl}/products/${this.escapeXml(
          product.slug,
        )}`,
        changefreq: 'daily' as const,
        priority: 0.9,
      })),

      // =========================================================
      // DYNAMIC CATEGORY URLS
      // =========================================================
      ...categories.map((category) => ({
        loc: `${this.baseUrl}/categories/${this.escapeXml(
          category.slug,
        )}`,
        changefreq: 'weekly' as const,
        priority: 0.9,
      })),

      // =========================================================
      // DYNAMIC SUBCATEGORY PRODUCT URLS
      // =========================================================
      ...subCategories.map((subCategory) => ({
        loc:
          `${this.baseUrl}/categories/` +
          `${this.escapeXml(subCategory.categorySlug)}/` +
          `${this.escapeXml(subCategory.slug)}/products`,
        changefreq: 'weekly' as const,
        priority: 0.8,
      })),

      // =========================================================
      // DYNAMIC COLLECTION URLS
      // =========================================================
      ...collections.map((collection) => ({
        loc: `${this.baseUrl}/collections/${this.escapeXml(
          collection.slug,
        )}`,
        changefreq: 'weekly' as const,
        priority: 0.8,
      })),
    ];

    return this.buildXml(urls);
  }

  // =========================================================
  // PRODUCTS
  // =========================================================

  private async getProducts(): Promise<
    Array<{ slug: string }>
  > {
    return this.prisma.product.findMany({
      where: {
        deletedAt: null,
        status: 'ACTIVE',
      },
      select: {
        slug: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // =========================================================
  // CATEGORIES
  // =========================================================

  private async getCategories(): Promise<
    Array<{ slug: string }>
  > {
    return this.prisma.category.findMany({
      where: {
        deletedAt: null,
        status: 'ACTIVE',
      },
      select: {
        slug: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // =========================================================
  // SUBCATEGORIES
  // =========================================================

  private async getSubCategories(): Promise<
    Array<{
      slug: string;
      categorySlug: string;
    }>
  > {
    const subCategories =
      await this.prisma.subCategory.findMany({
        where: {
          deletedAt: null,
          status: 'ACTIVE',
        },
        select: {
          slug: true,
          category: {
            select: {
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

    return subCategories
      .filter(
        (
          item,
        ): item is typeof item & {
          category: {
            slug: string;
          };
        } => Boolean(item.category?.slug),
      )
      .map((item) => ({
        slug: item.slug,
        categorySlug: item.category.slug,
      }));
  }

  // =========================================================
  // COLLECTIONS
  // =========================================================

  private async getCollections(): Promise<
    Array<{ slug: string }>
  > {
    return this.prisma.collection.findMany({
      where: {
        deletedAt: null,
        status: 'ACTIVE',
      },
      select: {
        slug: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // =========================================================
  // XML BUILDER
  // =========================================================

  private buildXml(urls: SitemapUrl[]): string {
    const uniqueUrls = Array.from(
      new Map(
        urls.map((url) => [url.loc, url]),
      ).values(),
    );

    const xmlUrls = uniqueUrls
      .map(
        (url) => `
  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlUrls}
</urlset>`;
  }

  // =========================================================
  // XML ESCAPE
  // =========================================================

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}