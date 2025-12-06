import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateBookingRequest, UpdateBookingRequest, BookingFilters } from '../types/booking.types';
import {
  createBooking,
  getBookingById,
  getMyBookings,
  getBookingsByPropertyId,
  searchBookings,
  updateBooking,
  deleteBooking,
  cancelBooking,
} from '../api/booking.api';

// Query Keys - Identificatori unici pentru cache
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters?: BookingFilters) => [...bookingKeys.lists(), filters] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
  myBookings: () => [...bookingKeys.all, 'my-bookings'] as const,
  byProperty: (propertyId: string) => [...bookingKeys.all, 'property', propertyId] as const,
};

/**
 * Hook pentru Get Booking by ID
 */
export const useBooking = (id: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: bookingKeys.detail(id!),
    queryFn: () => getBookingById(id!),
    enabled: enabled && !!id,
  });
};

/**
 * Hook pentru Get My Bookings
 */
export const useMyBookings = () => {
  return useQuery({
    queryKey: bookingKeys.myBookings(),
    queryFn: getMyBookings,
    staleTime: 1000 * 60 * 2, // 2 minute
  });
};

/**
 * Hook pentru Get Bookings by Property ID
 */
export const useBookingsByProperty = (propertyId: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: bookingKeys.byProperty(propertyId!),
    queryFn: () => getBookingsByPropertyId(propertyId!),
    enabled: enabled && !!propertyId,
  });
};

/**
 * Hook pentru Search Bookings
 */
export const useSearchBookings = (filters?: BookingFilters, enabled: boolean = true) => {
  return useQuery({
    queryKey: bookingKeys.list(filters),
    queryFn: () => searchBookings(filters),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minute
  });
};

/**
 * Hook pentru Create Booking
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => createBooking(data),
    onSuccess: () => {
      // Invalidează cache-ul pentru a forța refetch
      queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
};

/**
 * Hook pentru Update Booking
 */
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingRequest }) => updateBooking(id, data),
    onSuccess: (updatedBooking) => {
      // Actualizează cache-ul pentru booking-ul specific
      queryClient.setQueryData(bookingKeys.detail(updatedBooking.id), updatedBooking);
      // Invalidează listele
      queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
};

/**
 * Hook pentru Delete Booking
 */
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: (_, deletedId) => {
      // Șterge din cache booking-ul șters
      queryClient.removeQueries({ queryKey: bookingKeys.detail(deletedId) });
      // Invalidează listele
      queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
};

/**
 * Hook pentru Cancel Booking
 */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cancellationReason }: { id: string; cancellationReason?: string }) =>
      cancelBooking(id, cancellationReason),
    onSuccess: (cancelledBooking) => {
      // Actualizează cache-ul
      queryClient.setQueryData(bookingKeys.detail(cancelledBooking.id), cancelledBooking);
      // Invalidează listele
      queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
};