import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { validate, validateQuery } from '../middleware/validation.middleware';
import { createBookingSchema, updateBookingSchema, searchBookingSchema } from '../middleware/booking.validation';
import { authenticate } from '../middleware/auth.middleware';
import { BookingController } from '../controllers/booking.controller';

export function createBookingRoutes(prisma: PrismaClient): Router { 
    const router = Router();
    const bookingController = new BookingController(prisma);

    // POST /bookings
    router.post(
        '/',
        authenticate,
        validate(createBookingSchema),
        bookingController.create.bind(bookingController)
    );

    // GET /bookings/search (trebuie înainte de /:id)
    router.get(
        '/search',
        validateQuery(searchBookingSchema),
        bookingController.search.bind(bookingController)
    );

    // GET /bookings/my-bookings (trebuie înainte de /:id)
    router.get(
        '/my-bookings',
        authenticate,
        bookingController.getMyBookings.bind(bookingController)
    );

    // GET /bookings/property/:propertyId (trebuie înainte de /:id)
    router.get(
        '/property/:propertyId',
        authenticate,
        bookingController.getByPropertyId.bind(bookingController)
    );

    // GET /bookings/:id (trebuie după rutele specifice)
    router.get(
        '/:id',
        bookingController.getById.bind(bookingController)
    );

    // PUT /bookings/:id
    router.put(
        '/:id',
        authenticate,
        validate(updateBookingSchema),
        bookingController.update.bind(bookingController)
    );

    // DELETE /bookings/:id
    router.delete(
        '/:id',
        authenticate,
        bookingController.delete.bind(bookingController)
    );

    // POST /bookings/:id/cancel
    router.post(
        '/:id/cancel',
        authenticate,
        bookingController.cancel.bind(bookingController)
    );

    // POST /bookings/:id/confirm
    router.post(
        '/:id/confirm',
        authenticate,
        bookingController.confirm.bind(bookingController)
    );

    return router;
}