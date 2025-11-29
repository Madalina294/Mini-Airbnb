import { PrismaClient } from '@prisma/client';
import { PropertyRepository } from '../repositories/property.repository';
import {
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyQuery,
  PropertyResponse,
} from '../types/property.types';
import { NotFoundError, UnauthorizedError } from '../utils/errors.utils';

export class PropertyService {
  private propertyRepository: PropertyRepository;
  constructor(private prisma: PrismaClient) {
  this.propertyRepository = new PropertyRepository(prisma);
}

  async create(dto: CreatePropertyDto, userId: string): Promise<PropertyResponse> {
    const property = await this.propertyRepository.create({
      ...dto,
      images: dto.images || [],
      userId,
    });

    return this.mapToResponse(property);
  }

  // Găsește o proprietate după ID
  async findById(id: string): Promise<PropertyResponse> {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new NotFoundError('Property not found');
    }
    return this.mapToResponse(property);
  }

  // Găsește toate proprietățile unui user
  async findByUserId(userId: string): Promise<PropertyResponse[]> {
    const properties = await this.propertyRepository.findByUserId(userId);
    return properties.map((p) => this.mapToResponse(p));
  }

  // Căutare cu filtre
  async search(query: PropertyQuery): Promise<PropertyResponse[]> {
    const properties = await this.propertyRepository.search(query);
    return properties.map((p) => this.mapToResponse(p));
  }

  // Actualizează o proprietate
  async update(
    id: string,
    dto: UpdatePropertyDto,
    userId: string
  ): Promise<PropertyResponse> {
    // Verifică dacă proprietatea există
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new NotFoundError('Property not found');
    }

    // Verifică dacă user-ul este owner
    if (property.userId !== userId) {
      throw new UnauthorizedError('You are not the owner of this property');
    }

    const updated = await this.propertyRepository.update(id, dto);
    return this.mapToResponse(updated);
  }

  // Șterge o proprietate
  async delete(id: string, userId: string): Promise<void> {
    // Verifică dacă proprietatea există
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new NotFoundError('Property not found');
    }

    // Verifică dacă user-ul este owner
    if (property.userId !== userId) {
      throw new UnauthorizedError('You are not the owner of this property');
    }

    await this.propertyRepository.delete(id);
  }

  // Helper pentru mapare la response
  private mapToResponse(property: any): PropertyResponse {
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
      userId: property.userId,
      status: property.status,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }
}