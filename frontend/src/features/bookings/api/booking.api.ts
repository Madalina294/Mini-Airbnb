import axiosInstance from '../../../lib/axios';
import type { Booking, CreateBookingRequest, UpdateBookingRequest, BookingFilters } from '../types/booking.types';

// Tipuri pentru response-uri (conform backend)
interface BookingResponse {
  success: boolean;
  data: Booking;
}

interface BookingsListResponse {
  success: boolean;
  data: Booking[];
}

/**
 * Create Booking - Creează o rezervare nouă
 * POST /api/bookings
 */
export const createBooking = async (data: CreateBookingRequest): Promise<Booking> => {
  const response = (await axiosInstance.post('/bookings', data)) as unknown as BookingResponse;
  return response.data;
};

/**
 * Get Booking by ID - Obține detalii despre o rezervare
 * GET /api/bookings/:id
 */
export const getBookingById = async (id: string): Promise<Booking> => {
  const response = (await axiosInstance.get(`/bookings/${id}`)) as unknown as BookingResponse;
  return response.data;
};

/**
 * Get My Bookings - Obține toate rezervările utilizatorului curent
 * GET /api/bookings/my-bookings
 */
export const getMyBookings = async (): Promise<Booking[]> => {
  const response = (await axiosInstance.get('/bookings/my-bookings')) as unknown as BookingsListResponse;
  return response.data;
};

/**
 * Get Bookings by Property ID - Obține toate rezervările pentru o proprietate
 * GET /api/bookings/property/:propertyId
 */
export const getBookingsByPropertyId = async (propertyId: string): Promise<Booking[]> => {
  const response = (await axiosInstance.get(`/bookings/property/${propertyId}`)) as unknown as BookingsListResponse;
  return response.data;
};

/**
 * Search Bookings - Caută rezervări cu filtre
 * GET /api/bookings/search
 */
export const searchBookings = async (filters?: BookingFilters): Promise<Booking[]> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString();
  const path = queryString ? `/bookings/search?${queryString}` : '/bookings/search';

  const response = (await axiosInstance.get(path)) as unknown as BookingsListResponse;
  return response.data;
};

/**
 * Update Booking - Actualizează o rezervare
 * PUT /api/bookings/:id
 */
export const updateBooking = async (id: string, data: UpdateBookingRequest): Promise<Booking> => {
  const response = (await axiosInstance.put(`/bookings/${id}`, data)) as unknown as BookingResponse;
  return response.data;
};

/**
 * Delete Booking - Șterge o rezervare
 * DELETE /api/bookings/:id
 */
export const deleteBooking = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/bookings/${id}`);
};

/**
 * Cancel Booking - Anulează o rezervare
 * POST /api/bookings/:id/cancel
 */
export const cancelBooking = async (id: string, cancellationReason?: string): Promise<Booking> => {
  const response = (await axiosInstance.post(`/bookings/${id}/cancel`, { cancellationReason })) as unknown as BookingResponse;
  return response.data;
};