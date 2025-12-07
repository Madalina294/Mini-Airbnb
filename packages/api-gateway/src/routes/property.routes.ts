import { Router, Request, Response, NextFunction } from 'express';
import { HttpUtil } from '../utils/http.util';

// Routes pentru Property Service
// Proxy către Property Service

export function createPropertyRoutes(): Router {
  const router = Router();
  const propertyServiceUrl = process.env.PROPERTY_SERVICE_URL || 'http://localhost:3002';

  // POST /api/properties (necesită autentificare)
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const result = await HttpUtil.request(
        propertyServiceUrl,
        'POST',
        '/properties',
        req.body,
        token ? { Authorization: `Bearer ${token}` } : undefined
      );
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // GET /api/properties/search (public)
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
      const path = queryString ? `/properties/search?${queryString}` : '/properties/search';

      const result = await HttpUtil.request(
        propertyServiceUrl,
        'GET',
        path,
        undefined
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // GET /api/properties/my-properties (necesită autentificare)
  // IMPORTANT: Trebuie definită ÎNAINTE de /:id pentru că Express evaluează rutele în ordine
  router.get('/my-properties', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          success: false,
          error: { message: 'Token is required', statusCode: 401 },
        });
      }

      const result = await HttpUtil.request(
        propertyServiceUrl,
        'GET',
        '/properties/my-properties',
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // GET /api/properties/:id (public)
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await HttpUtil.request(
        propertyServiceUrl,
        'GET',
        `/properties/${req.params.id}`,
        undefined
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // PUT /api/properties/:id (necesită autentificare)
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
        propertyServiceUrl,
        'PUT',
        `/properties/${req.params.id}`,
        req.body,
        { Authorization: `Bearer ${token}` }
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // DELETE /api/properties/:id (necesită autentificare)
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
        propertyServiceUrl,
        'DELETE',
        `/properties/${req.params.id}`,
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // POST /api/favorites/:propertyId
  router.post('/favorites/:propertyId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const result = await HttpUtil.request(
        propertyServiceUrl,
        'POST',
        `/favorites/${req.params.propertyId}`,
        undefined,
        token ? { Authorization: `Bearer ${token}` } : undefined
      );
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // DELETE /api/favorites/:propertyId
  router.delete('/favorites/:propertyId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const result = await HttpUtil.request(
        propertyServiceUrl,
        'DELETE',
        `/favorites/${req.params.propertyId}`,
        undefined,
        token ? { Authorization: `Bearer ${token}` } : undefined
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // GET /api/favorites
  router.get('/favorites', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const result = await HttpUtil.request(
        propertyServiceUrl,
        'GET',
        '/favorites',
        undefined,
        token ? { Authorization: `Bearer ${token}` } : undefined
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // GET /api/favorites/:propertyId/check
  router.get('/favorites/:propertyId/check', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const result = await HttpUtil.request(
        propertyServiceUrl,
        'GET',
        `/favorites/${req.params.propertyId}/check`,
        undefined,
        token ? { Authorization: `Bearer ${token}` } : undefined
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  return router;
}