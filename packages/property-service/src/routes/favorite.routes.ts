import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { FavoriteController } from '../controllers/favorite.controller';
import { authenticate } from '../middleware/auth.middleware';

// Router pentru favorite endpoints

export function createFavoriteRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const favoriteController = new FavoriteController(prisma);

  // POST /favorites/:propertyId (necesită autentificare)
  router.post(
    '/:propertyId',
    authenticate,
    favoriteController.addToFavorites.bind(favoriteController)
  );

  // DELETE /favorites/:propertyId (necesită autentificare)
  router.delete(
    '/:propertyId',
    authenticate,
    favoriteController.removeFromFavorites.bind(favoriteController)
  );

  // GET /favorites (necesită autentificare)
  router.get(
    '/',
    authenticate,
    favoriteController.getMyFavorites.bind(favoriteController)
  );

  // GET /favorites/:propertyId/check (opțional - pentru a verifica dacă este favorite)
  router.get(
    '/:propertyId/check',
    authenticate,
    favoriteController.checkFavorite.bind(favoriteController)
  );

  return router;
}