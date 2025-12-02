export interface CreateBookingDto {
  propertyId: string;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  guests: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  specialRequests?: string;
}

export interface BookingResponse {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  guests: number;
  status: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  confirmedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateBookingDto {
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    cancellationReason?: string;
}

export interface BookingQuery{
  checkIn?: Date;
  checkOut?: Date;
  userId?: string;
  propertyId?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  page?: number;
  limit?: number;
}