import { z } from 'zod';

// Schema pentru Create Property
export const createPropertySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  bedrooms: z.number().int().min(1, 'Bedrooms must be at least 1'),
  bathrooms: z.number().int().min(1, 'Bathrooms must be at least 1'),
  maxGuests: z.number().int().min(1, 'Max guests must be at least 1'),
  facilities: z.array(z.string()).min(1, 'At least one facility is required'),
  images: z.array(z.string().url('Invalid image URL')).optional(),
});

// Schema pentru Update Property
export const updatePropertySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  bedrooms: z.number().int().min(1).optional(),
  bathrooms: z.number().int().min(1).optional(),
  maxGuests: z.number().int().min(1).optional(),
  facilities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'UNAVAILABLE']).optional(),
});

// Schema pentru Query (search filters)
export const propertyQuerySchema = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().min(1).optional(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'UNAVAILABLE']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});