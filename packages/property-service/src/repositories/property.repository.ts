import { PrismaClient } from '@prisma/client';
import { PropertyQuery } from '../types/property.types';

// Repository Pattern - similar cu JpaRepository în Spring

export class PropertyRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Găsește proprietate după ID
  async findById(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
    });
  }

  // Găsește toate proprietățile unui user
  async findByUserId(userId: string) {
    return this.prisma.property.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Căutare cu filtre
  async search(query: PropertyQuery) {
    const where: any = {};

    if (query.city) {
      where.city = { contains: query.city, mode: 'insensitive' };
    }
    if (query.country) {
      where.country = { contains: query.country, mode: 'insensitive' };
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }
    if (query.bedrooms) {
      where.bedrooms = { gte: query.bedrooms };
    }
    if (query.status) {
      where.status = query.status;
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    return this.prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Creează o proprietate nouă
  async create(data: {
    title: string;
    description: string;
    price: number;
    address: string;
    city: string;
    country: string;
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    facilities: string[];
    images: string[];
    userId: string;
  }) {
    return this.prisma.property.create({
      data,
    });
  }

  // Actualizează o proprietate
  async update(id: string, data: any) {
    return this.prisma.property.update({
      where: { id },
      data,
    });
  }

  // Șterge o proprietate
  async delete(id: string) {
    return this.prisma.property.delete({
      where: { id },
    });
  }

  // Verifică dacă proprietatea aparține unui user
  async isOwner(propertyId: string, userId: string): Promise<boolean> {
    const property = await this.findById(propertyId);
    return property?.userId === userId;
  }
}