import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';
import { BookingService } from "../services/booking.service";
import { BadRequestError, UnauthorizedError } from "../utils/errors.utils";
import { AuthRequest } from "../middleware/auth.middleware";
import { CreateBookingDto, UpdateBookingDto } from "../types/booking.types";

export class BookingController{
    private bookingService: BookingService;

    constructor(private prisma: PrismaClient){
        this.bookingService = new BookingService(prisma);
    }

    // POST /bookings
    async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                return next(new UnauthorizedError('Authentication required'));
            }
            const dto: CreateBookingDto = req.body;
            const result = await this.bookingService.create(dto, req.user.userId);
            res.status(201).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            next(error);
        }
    }

    // GET /bookings/:id
    async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.bookingService.getById(req.params.id);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            next(error);
        }
    }

    // GET /bookings/my-bookings
    async getMyBookings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                return next(new UnauthorizedError('Authentication required'));
            }
            const result = await this.bookingService.getByUserId(req.user.userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            next(error);
        }
    }

    // GET /bookings/property/:propertyId
    async getByPropertyId(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                return next(new UnauthorizedError('Authentication required'));
            }
            
            const result = await this.bookingService.getByPropertyId(req.params.propertyId, req.user.userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            next(error);
        }
    }

    // GET /bookings/search
    async search(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.bookingService.search(req.query);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            next(error);
        }
    }

    // PUT /bookings/:id
    async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                return next(new UnauthorizedError('Authentication required'));
            }
            const id = req.params.id;
            if (!id) {
                return next(new BadRequestError('Booking ID is required'));
            }
            const dto: UpdateBookingDto = req.body;
            if (!dto) {
                return next(new BadRequestError('Booking data is required'));
            }
            const result = await this.bookingService.update(req.params.id, dto, req.user.userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            next(error);
        }
    }

    // DELETE /bookings/:id
    async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                return next(new UnauthorizedError('Authentication required'));
            }
            const id = req.params.id;
            if (!id) {
                return next(new BadRequestError('Booking ID is required'));
            }
            await this.bookingService.delete(id, req.user.userId);
            res.status(200).json({
                success: true,
                message: 'Booking deleted successfully',
            });
        } catch (error: any) {
            next(error);
        }
    }

    // POST /bookings/:id/cancel
    async cancel(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                return next(new UnauthorizedError('Authentication required'));
            }
            const id = req.params.id;
            if (!id) {
                return next(new BadRequestError('Booking ID is required'));
            }
            const result = await this.bookingService.cancel(id, req.user.userId, req.body.reason);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            next(error);
        }
    }

    // POST /bookings/:id/confirm
    async confirm(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                return next(new UnauthorizedError('Authentication required'));
            }
            const id = req.params.id;
            if (!id) {
                return next(new BadRequestError('Booking ID is required'));
            }
            const result = await this.bookingService.confirm(id, req.user.userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            next(error);
        }
    }
}
