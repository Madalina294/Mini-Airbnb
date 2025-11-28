import { Router, Request, Response, NextFunction } from 'express';
import { HttpUtil } from '../utils/http.util';

// Routes pentru Auth Service
// Proxy către Auth Service

export function createAuthRoutes(): Router {
  const router = Router();
  const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

  // POST /api/auth/register (public)
  router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await HttpUtil.request(
        authServiceUrl,
        'POST',
        '/auth/register',
        req.body
      );
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // POST /api/auth/login (public)
  router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await HttpUtil.request(
        authServiceUrl,
        'POST',
        '/auth/login',
        req.body
      );
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  });

  // POST /api/auth/validate (necesită autentificare)
  router.post('/validate', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const result = await HttpUtil.request(
        authServiceUrl,
        'POST',
        '/auth/validate',
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