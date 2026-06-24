// src/modules/customer/infrastructure/repositories/prisma-customer.repository.ts

import { Injectable } from '@nestjs/common';

import { Prisma, UserRole } from '@prisma/client';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

import { CustomerDetailDto } from '../../domain/dto/customer-detail.dto';

import { CustomerListDto } from '../../domain/dto/customer-list.dto';

import { CustomerDomainService } from '../../domain/services/customer-domain.service';

@Injectable()
export class PrismaCustomerRepository {
  constructor(
    private readonly prisma: PrismaService,

    private readonly domainService: CustomerDomainService,
  ) {}

  // =======================
  // 🔍 GET CUSTOMER
  // =======================

  async findById(
    userId: string,
  ): Promise<CustomerDetailDto | null> {
    console.log('\n👤 [GET CUSTOMER]');

    console.log('➡️ User ID:', userId);

    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },

        include: {
          profile: true,

          identities: {
            where: {
              deletedAt: null,
            },
          },

          orders: {
            where: {
              deletedAt: null,
            },
          },
        },
      });

    console.log(
      '➡️ User found:',
      !!user,
    );

    if (!user) {
      return null;
    }

    // =======================
    // 📊 STATS
    // =======================

    const totalSpent =
      this.domainService.calculateTotalSpent(
        user.orders ?? [],
      );

    const totalOrders =
      this.domainService.calculateTotalOrders(
        user.orders ?? [],
      );

    // =======================
    // ✅ RESPONSE
    // =======================

    return {
      id: user.id,

      role: user.role,

      isActive: user.isActive,

      tokenVersion:
        user.tokenVersion,

      profile: user.profile
        ? {
            id: user.profile.id,

            name:
              user.profile.name ??
              undefined,

            email:
              user.profile.email ??
              undefined,

            phoneNumber:
              user.profile
                .phoneNumber ??
              undefined,

            avatarUrl:
              user.profile
                .avatarUrl ??
              undefined,
          }
        : null,

      identities:
        (user.identities ?? []).map(
          (identity) => ({
            id: identity.id,

            type: identity.type,

            value: identity.value,

            isVerified:
              identity.isVerified,

            isTotpEnabled:
              identity.isTotpEnabled,
          }),
        ),

      stats: {
        totalOrders,

        totalSpent,
      },

      createdAt:
        user.createdAt,

      updatedAt:
        user.updatedAt,
    };
  }

  // =======================
  // 📋 GET CUSTOMERS
  // =======================

  async findMany(params?: {
    search?: string;

    page?: number;

    limit?: number;
  }): Promise<{
    customers: CustomerListDto[];

    total: number;

    page: number;

    limit: number;

    totalPages: number;
  }> {
    console.log(
      '\n📋 [GET CUSTOMERS]',
    );

    const page =
      Number(params?.page) || 1;

    const limit = Math.min(
      Number(params?.limit) || 20,
      100,
    );

    const search =
      params?.search?.trim();

    // =======================
    // ✅ WHERE
    // =======================

    const where: Prisma.UserWhereInput =
      {
        deletedAt: null,

        role: UserRole.USER,

        ...(search
          ? {
              OR: [
                {
                  profile: {
                    name: {
                      contains:
                        search,

                      mode:
                        'insensitive',
                    },
                  },
                },

                {
                  profile: {
                    email: {
                      contains:
                        search,

                      mode:
                        'insensitive',
                    },
                  },
                },

                {
                  profile: {
                    phoneNumber: {
                      contains:
                        search,
                    },
                  },
                },
              ],
            }
          : {}),
      };

    // =======================
    // ✅ FETCH USERS
    // =======================

    const users =
      await this.prisma.user.findMany(
        {
          where,

          include: {
  profile: true,

  identities: {
    where: {
      deletedAt: null,
    },
  },

  orders: {
              where: {
                deletedAt: null,
              },
            },
          },

          skip:
            (page - 1) * limit,

          take: limit,

          orderBy: {
            createdAt: 'desc',
          },
        },
      );

    // =======================
    // ✅ TOTAL
    // =======================

    const total =
      await this.prisma.user.count({
        where,
      });

    // =======================
    // 🧠 MAP DATA
    // =======================

    const data: CustomerListDto[] =
      users.map((user) => ({
        id: user.id,

        role: user.role,

        name:
          user.profile?.name ??
          undefined,

        email:
  user.profile?.email ??
  user.identities?.find(
    (identity) =>
      identity.type === 'EMAIL',
  )?.value ??
  undefined,

phoneNumber:
  user.profile?.phoneNumber ??
  user.identities?.find(
    (identity) =>
      identity.type === 'PHONE',
  )?.value ??
  undefined,

        avatarUrl:
          user.profile
            ?.avatarUrl ??
          undefined,

        isActive:
          user.isActive,

        totalOrders:
          (user.orders ?? [])
            .length,

        totalSpent:
          this.domainService.calculateTotalSpent(
            user.orders ?? [],
          ),

        createdAt:
          user.createdAt,
      }));

    // =======================
    // ✅ RESPONSE
    // =======================

    return {
  customers: data,

  total,

  page,

  limit,

  totalPages: Math.ceil(
    total / limit,
  ),
};
  }
}