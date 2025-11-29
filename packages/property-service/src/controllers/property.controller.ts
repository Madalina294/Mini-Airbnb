import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { PropertyService } from '../services/property.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { UnauthorizedError } from '../utils/errors.utils';

// Controller - HTTP endpoints
// Similar cu @RestController în Spring Boot

export class PropertyController {
  private propertyService: PropertyService;

  constructor(private prisma: PrismaClient) { 
    this.propertyService = new PropertyService(prisma);
  }

  // POST /properties
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const result = await this.propertyService.create(req.body, req.user.userId);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // GET /properties/:id
  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.propertyService.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // GET /properties/search
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.propertyService.search(req.query as any);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // GET /properties/my-properties
  async getMyProperties(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const result = await this.propertyService.findByUserId(req.user.userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // PUT /properties/:id
  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const result = await this.propertyService.update(
        req.params.id,
        req.body,
        req.user.userId
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // DELETE /properties/:id
  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      await this.propertyService.delete(req.params.id, req.user.userId);
      res.status(200).json({
        success: true,
        message: 'Property deleted successfully',
      });
    } catch (error: any) {
      next(error);
    }
  }
}