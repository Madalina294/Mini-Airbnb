// Types pentru Property Service
// Similar cu DTOs în Spring Boot

export interface CreatePropertyDto {
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
  images?: string[];
}

export interface UpdatePropertyDto {
  title?: string;
  description?: string;
  price?: number;
  address?: string;
  city?: string;
  country?: string;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  facilities?: string[];
  images?: string[];
  status?: 'AVAILABLE' | 'RESERVED' | 'UNAVAILABLE';
}

export interface PropertyResponse {
  id: string;
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
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyQuery {
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  status?: 'AVAILABLE' | 'RESERVED' | 'UNAVAILABLE';
  page?: number;
  limit?: number;
}