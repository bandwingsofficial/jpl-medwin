// src/modules/saved-address/infrastructure/persistence/prisma/repositories/prisma-saved-address.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { SavedAddressRepository } from '../../../../domain/repositories/saved-address.repository';

import { SavedAddress } from '../../../../domain/entities/saved-address.entity';

import { AddressType } from '../../../../domain/enums/address-type.enum';

import { SavedAddressMapper } from '../mappers/saved-address.mapper';

@Injectable()
export class PrismaSavedAddressRepository implements SavedAddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<SavedAddress | null> {
    const data = await this.prisma.savedAddress.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return data ? SavedAddressMapper.toDomain(data) : null;
  }

  async findByIdIncludingDeleted(id: string): Promise<SavedAddress | null> {
    const data = await this.prisma.savedAddress.findFirst({
      where: { id },
    });

    return data ? SavedAddressMapper.toDomain(data) : null;
  }

  async findAllByUser(userId: string): Promise<SavedAddress[]> {
    const data = await this.prisma.savedAddress.findMany({
      where: {
        userId,
        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((a) => SavedAddressMapper.toDomain(a));
  }

  async findAllByUserIncludingDeleted(userId: string): Promise<SavedAddress[]> {
    const data = await this.prisma.savedAddress.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((a) => SavedAddressMapper.toDomain(a));
  }

  async findDefaultByUser(userId: string): Promise<SavedAddress | null> {
    const data = await this.prisma.savedAddress.findFirst({
      where: {
        userId,

        isDefault: true,

        deletedAt: null,
      },
    });

    return data ? SavedAddressMapper.toDomain(data) : null;
  }

  async findByType(
    userId: string,

    type: AddressType,
  ): Promise<SavedAddress[]> {
    const data = await this.prisma.savedAddress.findMany({
      where: {
        userId,
        type,
        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((a) => SavedAddressMapper.toDomain(a));
  }

  async findAllByPhoneNumber(phoneNumber: string): Promise<SavedAddress[]> {
    const data = await this.prisma.savedAddress.findMany({
      where: {
        phoneNumber,
        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((a) => SavedAddressMapper.toDomain(a));
  }

  async findSingleTypeAddress(
    userId: string,

    type: AddressType,
  ): Promise<SavedAddress | null> {
    const data = await this.prisma.savedAddress.findFirst({
      where: {
        userId,
        type,
        deletedAt: null,
      },
    });

    return data ? SavedAddressMapper.toDomain(data) : null;
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.savedAddress.count({
      where: {
        id,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async existsDefaultAddress(userId: string): Promise<boolean> {
    const count = await this.prisma.savedAddress.count({
      where: {
        userId,
        isDefault: true,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async countOrderReferences(addressId: string): Promise<number> {
    return this.prisma.order.count({
      where: {
        deletedAt: null,
        OR: [{ shippingAddressId: addressId }, { billingAddressId: addressId }],
      },
    });
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(address: SavedAddress): Promise<SavedAddress> {
    const data = await this.prisma.savedAddress.create({
      data: SavedAddressMapper.toPersistence(address),
    });

    return SavedAddressMapper.toDomain(data);
  }

  async update(address: SavedAddress): Promise<SavedAddress> {
    const data = await this.prisma.savedAddress.update({
      where: {
        id: address.id,
      },

      data: SavedAddressMapper.toPersistence(address),
    });

    return SavedAddressMapper.toDomain(data);
  }

  // =======================
  // 🚚 DEFAULT
  // =======================

  async clearDefaultAddresses(userId: string): Promise<void> {
    await this.prisma.savedAddress.updateMany({
      where: {
        userId,

        isDefault: true,

        deletedAt: null,
      },

      data: {
        isDefault: false,
      },
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  async softDelete(id: string): Promise<void> {
    await this.prisma.savedAddress.update({
      where: { id },

      data: {
        deletedAt: new Date(),

        isDefault: false,
      },
    });
  }

  // =======================
  // ♻️ RESTORE
  // =======================

  async restore(id: string): Promise<void> {
    await this.prisma.savedAddress.update({
      where: { id },

      data: {
        deletedAt: null,
      },
    });
  }
}
