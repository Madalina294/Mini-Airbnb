import { PrismaClient } from '@prisma/client';

// Repository - Acces la baza de date
// Similar cu JPA Repository în Spring Boot

export class FavoriteRepository {
  constructor(private prisma: PrismaClient) {}

  // Adaugă o proprietate la favorite
  async create(userId: string, propertyId: string) {
    return await this.prisma.favorite.create({
      data: {
        userId,
        propertyId,
      },
    });
  }

  // Șterge o proprietate din favorite
  async delete(userId: string, propertyId: string) {
    return await this.prisma.favorite.deleteMany({
      where: {
        userId,
        propertyId,
      },
    });
  }

  // Verifică dacă o proprietate este în favorite
  async exists(userId: string, propertyId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });
    return !!favorite;
  }

  // Obține toate favorite-urile unui user cu proprietățile asociate
  async findByUserId(userId: string) {
    return await this.prisma.favorite.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Obține toate favorite-urile pentru o proprietate (pentru statistici)
  async findByPropertyId(propertyId: string) {
    return await this.prisma.favorite.count({
      where: {
        propertyId,
      },
    });
  }
}