/**
 * Property Types
 */

export interface Property {
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
  status: 'AVAILABLE' | 'RESERVED' | 'UNAVAILABLE';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  status?: Property['status'];
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}