import { PrismaClient } from '@prisma/client';
import { FavoriteRepository } from '../repositories/favorite.repository';
import { NotFoundError, ConflictError } from '../utils/errors.utils';
import { PropertyRepository } from '../repositories/property.repository';

// Service - Logică de business

export class FavoriteService {
  private favoriteRepository: FavoriteRepository;
  private propertyRepository: PropertyRepository;

  constructor(private prisma: PrismaClient) {
    this.favoriteRepository = new FavoriteRepository(prisma);
    this.propertyRepository = new PropertyRepository(prisma);
  }

  // Adaugă o proprietate la favorite
  async addToFavorites(userId: string, propertyId: string) {
    // Verifică dacă proprietatea există
    const property = await this.propertyRepository.findById(propertyId);
    if (!property) {
      throw new NotFoundError('Property not found');
    }

    // Verifică dacă este deja în favorite
    const exists = await this.favoriteRepository.exists(userId, propertyId);
    if (exists) {
      throw new ConflictError('Property is already in favorites');
    }

    // Adaugă la favorite
    return await this.favoriteRepository.create(userId, propertyId);
  }

  // Șterge o proprietate din favorite
  async removeFromFavorites(userId: string, propertyId: string) {
    const exists = await this.favoriteRepository.exists(userId, propertyId);
    if (!exists) {
      throw new NotFoundError('Favorite not found');
    }

    await this.favoriteRepository.delete(userId, propertyId);
  }

  // Obține toate favorite-urile unui user
  async getMyFavorites(userId: string) {
    const favorites = await this.favoriteRepository.findByUserId(userId);
    
    // Dacă nu există favorite-uri, returnează array gol
    if (favorites.length === 0) {
      return [];
    }
    
    // Obține proprietățile asociate
    const propertyIds = favorites.map((f) => f.propertyId);
    const properties = await this.propertyRepository.findByIds(propertyIds);

    // Creează un map pentru acces rapid la proprietăți
    const propertyMap = new Map(properties.map((p) => [p.id, p]));

    // Mapare pentru a returna proprietățile în ordinea în care au fost adăugate la favorite
    return favorites
      .map((favorite) => {
        const property = propertyMap.get(favorite.propertyId);
        if (!property) {
          return null; // Proprietatea a fost ștearsă
        }
        return {
          ...this.mapToResponse(property),
          favoritedAt: favorite.createdAt,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }

  // Verifică dacă o proprietate este în favorite
  async isFavorite(userId: string, propertyId: string): Promise<boolean> {
    return await this.favoriteRepository.exists(userId, propertyId);
  }

  // Mapare la formatul de răspuns
  private mapToResponse(property: any) {
    return {
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      address: property.address,
      city: property.city,
      country: property.country,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      maxGuests: property.maxGuests,
      facilities: property.facilities,
      images: property.images,
      status: property.status,
      userId: property.userId,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }
}