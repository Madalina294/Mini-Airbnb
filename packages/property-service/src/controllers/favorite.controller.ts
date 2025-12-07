import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { FavoriteService } from '../services/favorite.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { UnauthorizedError } from '../utils/errors.utils';

// Controller - HTTP endpoints
// Similar cu @RestController în Spring Boot

export class FavoriteController {
  private favoriteService: FavoriteService;

  constructor(private prisma: PrismaClient) {
    this.favoriteService = new FavoriteService(prisma);
  }

  // POST /favorites/:propertyId
  async addToFavorites(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const result = await this.favoriteService.addToFavorites(
        req.user.userId,
        req.params.propertyId
      );
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // DELETE /favorites/:propertyId
  async removeFromFavorites(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      await this.favoriteService.removeFromFavorites(
        req.user.userId,
        req.params.propertyId
      );
      res.status(200).json({
        success: true,
        message: 'Favorite removed successfully',
      });
    } catch (error: any) {
      next(error);
    }
  }

  // GET /favorites
  async getMyFavorites(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const result = await this.favoriteService.getMyFavorites(req.user.userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // GET /favorites/:propertyId/check
  async checkFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(200).json({
          success: true,
          data: { isFavorite: false },
        });
        return;
      }

      const isFavorite = await this.favoriteService.isFavorite(
        req.user.userId,
        req.params.propertyId
      );
      res.status(200).json({
        success: true,
        data: { isFavorite },
      });
    } catch (error: any) {
      next(error);
    }
  }
}