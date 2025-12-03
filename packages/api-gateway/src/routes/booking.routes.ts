import { Router, Request, Response, NextFunction } from 'express';
import { HttpUtil } from '../utils/http.util';

// Routes pentru Booking Service
// Proxy către Booking Service

export function createBookingRoutes(): Router {
  const router = Router();
  const bookingServiceUrl = process.env.BOOKING_SERVICE_URL || 'http://localhost:3003';

  // POST /api/bookings (necesită autentificare)
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          success: false,
          error: { message: 'Token is required', statusCode: 401 },
        });
      }

      const result = await HttpUtil.request(
        bookingServiceUrl,
        'POST',
        '/bookings',
        req.body,
        { Authorization: `Bearer ${token}` }
      );
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // GET /api/bookings/search (public sau autentificat)
  router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Construiește query string din query parameters
      const queryParams = new URLSearchParams();
      Object.entries(req.query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      const path = queryString ? `/bookings/search?${queryString}` : '/bookings/search';

      const token = req.headers.authorization?.replace('Bearer ', '');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const result = await HttpUtil.request(
        bookingServiceUrl,
        'GET',
        path,
        undefined,
        headers
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // GET /api/bookings/my-bookings (necesită autentificare)
  // IMPORTANT: Trebuie definită ÎNAINTE de /:id pentru că Express evaluează rutele în ordine
  router.get('/my-bookings', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          success: false,
          error: { message: 'Token is required', statusCode: 401 },
        });
      }

      const result = await HttpUtil.request(
        bookingServiceUrl,
        'GET',
        '/bookings/my-bookings',
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // GET /api/bookings/property/:propertyId (necesită autentificare)
  // IMPORTANT: Trebuie definită ÎNAINTE de /:id
  router.get('/property/:propertyId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          success: false,
          error: { message: 'Token is required', statusCode: 401 },
        });
      }

      const result = await HttpUtil.request(
        bookingServiceUrl,
        'GET',
        `/bookings/property/${req.params.propertyId}`,
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // GET /api/bookings/:id (public sau autentificat)
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const result = await HttpUtil.request(
        bookingServiceUrl,
        'GET',
        `/bookings/${req.params.id}`,
        undefined,
        headers
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // PUT /api/bookings/:id (necesită autentificare)
  router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          success: false,
          error: { message: 'Token is required', statusCode: 401 },
        });
      }

      const result = await HttpUtil.request(
        bookingServiceUrl,
        'PUT',
        `/bookings/${req.params.id}`,
        req.body,
        { Authorization: `Bearer ${token}` }
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // DELETE /api/bookings/:id (necesită autentificare)
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          success: false,
          error: { message: 'Token is required', statusCode: 401 },
        });
      }

      const result = await HttpUtil.request(
        bookingServiceUrl,
        'DELETE',
        `/bookings/${req.params.id}`,
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // POST /api/bookings/:id/cancel (necesită autentificare)
  router.post('/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          success: false,
          error: { message: 'Token is required', statusCode: 401 },
        });
      }

      const result = await HttpUtil.request(
        bookingServiceUrl,
        'POST',
        `/bookings/${req.params.id}/cancel`,
        req.body, // Poate conține { reason: "..." }
        { Authorization: `Bearer ${token}` }
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // POST /api/bookings/:id/confirm (necesită autentificare)
  router.post('/:id/confirm', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          success: false,
          error: { message: 'Token is required', statusCode: 401 },
        });
      }

      const result = await HttpUtil.request(
        bookingServiceUrl,
        'POST',
        `/bookings/${req.params.id}/confirm`,
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  return router;
}

