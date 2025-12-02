import { z } from 'zod';

// Schema pentru Create Booking
export const createBookingSchema = z.object({
  checkIn: z.string().datetime('Invalid check-in date'),
  checkOut: z.string().datetime('Invalid check-out date'),
  guests: z.number().int().min(1, 'At least one guest is required'),
  guestName: z.string().optional(),
  guestEmail: z.string().email('Invalid email address').optional(),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

// Schema pentru Update Booking 
export const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  cancellationReason: z.string().optional(),
});

// Schema pentru Search Booking
export const searchBookingSchema = z.object({
  checkIn: z.string().datetime('Invalid check-in date').optional(),
  checkOut: z.string().datetime('Invalid check-out date').optional(),
  userId: z.string().uuid('Invalid user ID').optional(),
  propertyId: z.string().uuid('Invalid property ID').optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
});