/**
 * Booking Types
 */

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  totalPrice: number;
  guests: number;
  status: BookingStatus;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  propertyId: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  guests: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  specialRequests?: string;
}

export interface UpdateBookingRequest {
  status?: BookingStatus;
  cancellationReason?: string;
}

export interface BookingFilters {
  propertyId?: string;
  userId?: string;
  status?: BookingStatus;
  checkIn?: string;
  checkOut?: string;
}