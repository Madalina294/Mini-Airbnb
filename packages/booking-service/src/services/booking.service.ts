import { PrismaClient } from '@prisma/client';
import { BookingRepository } from '../repositories/booking.repository';
import { CreateBookingDto, UpdateBookingDto, BookingQuery, BookingResponse } from '../types/booking.types';
import { NotFoundError, UnauthorizedError, ConflictError, BadRequestError } from '../utils/errors.utils';
import axios from 'axios';

export class BookingService {
    private bookingRepository: BookingRepository;
    private propertyServiceUrl: string;

    constructor(private prisma: PrismaClient) {
        this.bookingRepository = new BookingRepository(prisma);
        this.propertyServiceUrl = process.env.PROPERTY_SERVICE_URL || 'http://localhost:3002';
    }

    // Creează o rezervare
    async create(dto: CreateBookingDto, userId: string): Promise<BookingResponse> {
        // 1. Validare date
        const checkIn = new Date(dto.checkIn);
        const checkOut = new Date(dto.checkOut);
        
        if (checkIn >= checkOut) {
            throw new BadRequestError('checkIn must be before checkOut');
        }
        
        if (checkIn < new Date()) {
            throw new BadRequestError('checkIn cannot be in the past');
        }
        
        // 2. Verifică disponibilitatea
        const isAvailable = await this.bookingRepository.isAvailable(
            checkIn,
            checkOut,
            dto.propertyId
        );
        
        if (!isAvailable) {
            throw new ConflictError('Property is not available for the selected dates');
        }
        
        // 3. Obține prețul proprietății din Property Service
        const property = await this.getPropertyFromService(dto.propertyId);
        
        // 4. Calculează totalPrice
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = property.price * nights;
        
        // 5. Creează booking-ul
        const booking = await this.bookingRepository.create({
            propertyId: dto.propertyId,
            userId,
            checkIn,
            checkOut,
            totalPrice,
            guests: dto.guests,
            guestName: dto.guestName,
            guestEmail: dto.guestEmail,
            guestPhone: dto.guestPhone,
            specialRequests: dto.specialRequests,
        });
        
        return this.mapToResponse(booking);
    }

    // Helper pentru a obține proprietatea din Property Service
    private async getPropertyFromService(propertyId: string) {
        try {
            const response = await axios.get(`${this.propertyServiceUrl}/properties/${propertyId}`);
            return response.data.data; // { id, price, ... }
        } catch (error: any) {
            if (error.response?.status === 404) {
            throw new NotFoundError('Property not found');
            }
            throw new Error('Failed to fetch property from Property Service');
        }
    }

    // Helper pentru mapare la response
    private mapToResponse(booking: any): BookingResponse {
        return {
            id: booking.id,
            propertyId: booking.propertyId,
            userId: booking.userId,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            totalPrice: booking.totalPrice,
            guests: booking.guests,
            status: booking.status,
            guestName: booking.guestName,
            guestEmail: booking.guestEmail,
            guestPhone: booking.guestPhone,
            specialRequests: booking.specialRequests,
            cancellationReason: booking.cancellationReason,
            cancelledAt: booking.cancelledAt,
            confirmedAt: booking.confirmedAt,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
        };
    }

    // Get a booking by ID
    async getById(id: string): Promise<BookingResponse> { 
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundError('Booking not found');
        }
        return this.mapToResponse(booking);
    }

    // Get bookings by user ID
    async getByUserId(userId: string): Promise<BookingResponse[]> {
        const bookings = await this.bookingRepository.findByUserId(userId);
        return bookings.map(this.mapToResponse);
    }

    // Get bookings by property ID
    async getByPropertyId(propertyId: string, userId?: string): Promise<BookingResponse[]> {
        if (userId) {
            const property = await this.getPropertyFromService(propertyId);
            if (property.userId !== userId) {
                throw new UnauthorizedError('You are not the owner of this property');
            }
        }
        const bookings = await this.bookingRepository.findByPropertyId(propertyId);
        return bookings.map(this.mapToResponse);
    }

    // Search bookings with filters
    async search(query: BookingQuery): Promise<BookingResponse[]> {
        const bookings = await this.bookingRepository.search(query);
        return bookings.map(this.mapToResponse);
    }

    // Update a booking
    async update(id: string, data: UpdateBookingDto, userId: string): Promise<BookingResponse> {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundError('Booking not found');
        }
        if (booking.userId !== userId) {
            throw new UnauthorizedError('You are not the owner of this booking');
        }
        const updated = await this.bookingRepository.update(id, data);
        return this.mapToResponse(updated);
    }

    // Delete a booking
    async delete(id: string, userId: string): Promise<void> {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundError('Booking not found');
        }
    
        if (booking.userId !== userId) {
            throw new UnauthorizedError('You are not the owner of this booking');
        }
        await this.bookingRepository.delete(id);
    }

    // Cancel a booking
    async cancel(id: string, userId: string, reason?: string): Promise<BookingResponse> {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundError('Booking not found');
        }
        
        if (booking.userId !== userId) {
            throw new UnauthorizedError('You are not the owner of this booking');
        }
        
        // Verifică dacă booking-ul poate fi anulat
        if (booking.status === 'CANCELLED') {
            throw new BadRequestError('Booking is already cancelled');
        }
        
        if (booking.status === 'COMPLETED') {
            throw new BadRequestError('Cannot cancel a completed booking');
        }
        
        const cancelled = await this.bookingRepository.update(id, {
            status: 'CANCELLED',
            cancellationReason: reason
        });
        return this.mapToResponse(cancelled);
    }

    // Confirm a booking
    async confirm(id: string, userId: string): Promise<BookingResponse> {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundError('Booking not found');
        }
        
        // Verifică dacă status-ul permite confirmarea
        if (booking.status !== 'PENDING') {
            throw new BadRequestError('Only PENDING bookings can be confirmed');
        }
        
        // Obține proprietatea și verifică dacă user-ul este host-ul
        const property = await this.getPropertyFromService(booking.propertyId);
        if (property.userId !== userId) {
            throw new UnauthorizedError('Only the property owner can confirm bookings');
        }
        
        const confirmed = await this.bookingRepository.update(id, { status: 'CONFIRMED' });
        return this.mapToResponse(confirmed);
    }

}