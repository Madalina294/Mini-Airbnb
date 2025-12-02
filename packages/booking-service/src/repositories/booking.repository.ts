import { PrismaClient } from '@prisma/client';
import { BookingQuery, CreateBookingDto, UpdateBookingDto } from '../types/booking.types';

export class BookingRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

    // Găsește o rezervare după ID
    async findById(id: string) {
        return this.prisma.booking.findUnique({
        where: { id },
        });
    }

    // Găsește toate rezervările unui user
    async findByUserId(userId: string) {
        return this.prisma.booking.findMany({
            where: { userId },
        });
    }

    // Găsește toate rezervările unei proprietăți
    async findByPropertyId(propertyId: string) {
        return this.prisma.booking.findMany({
            where: { propertyId },
        });
    }

    // Căutare cu filtre
    async search(query: BookingQuery) {
        const where: any = {};

        if (query.userId) {
            where.userId = query.userId;
        }
        if (query.propertyId) {
            where.propertyId = query.propertyId;
        }
        if (query.status) {
            where.status = query.status;
        }
        
        // Filtrare după perioadă (dacă sunt ambele date)
        if (query.checkIn && query.checkOut) {
            where.checkIn = { gte: query.checkIn };
            where.checkOut = { lte: query.checkOut };
        } else if (query.checkIn) {
            where.checkIn = { gte: query.checkIn };
        } else if (query.checkOut) {
            where.checkOut = { lte: query.checkOut };
        }

        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;

        return this.prisma.booking.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }

    // Creează o rezervare nouă
    async create(data: {
        propertyId: string;
        userId: string;
        checkIn: Date;
        checkOut: Date;
        totalPrice: number;
        guests: number;
        guestName?: string;
        guestEmail?: string;
        guestPhone?: string;
        specialRequests?: string;
    }) {
        return this.prisma.booking.create({
            data,
        });
    }
    

    // Actualizează o rezervare
    async update(id: string, data: UpdateBookingDto) {
        const updateData: any = { ...data };
        
        // Dacă status devine CANCELLED, setează cancelledAt
        if (data.status === 'CANCELLED' && !data.cancellationReason) {
            updateData.cancelledAt = new Date();
        }
        
        // Dacă status devine CONFIRMED, setează confirmedAt
        if (data.status === 'CONFIRMED') {
            updateData.confirmedAt = new Date();
        }
        
        return this.prisma.booking.update({
            where: { id },
            data: updateData,
        });
    }

    // Șterge o rezervare
    async delete(id: string) {
        return this.prisma.booking.delete({
            where: { id },
        });
    }

    //verifică disponibilitatea (booking-uri care se suprapun)
    async findOverlappingBookings(newcheckIn: Date, newcheckOut: Date, propertyId: string) {
        return this.prisma.booking.findMany({
            where: {
            propertyId,
            status: { not: 'CANCELLED' },
            checkIn: { lt: newcheckOut },   // checkIn existent < checkOut nou
            checkOut: { gt: newcheckIn }    // checkOut existent > checkIn nou
        },
        });
    }

    async isAvailable(checkIn: Date, checkOut: Date, propertyId: string): Promise<boolean> {
        const overlapping = await this.findOverlappingBookings(checkIn, checkOut, propertyId);
        return overlapping.length === 0;
}

}