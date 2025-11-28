import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/auth.service';
import { BadRequestError, ConflictError, UnauthorizedError } from '../utils/errors.utils';

// Controller - HTTP endpoints
// Similar cu @RestController în Spring Boot

export class AuthController {
  private authService: AuthService;

  constructor(private prisma: PrismaClient) {
    this.authService = new AuthService(prisma);
  }

  // POST /auth/register
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.message === 'Email already exists') {
        return next(new ConflictError('Email already exists'));
      }
      next(error);
    }
  }

  // POST /auth/login
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return next(new UnauthorizedError('Invalid email or password'));
      }
      next(error);
    }
  }

  // POST /auth/validate
  async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return next(new UnauthorizedError('Token is required'));
      }

      const result = await this.authService.validateToken(token);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(new UnauthorizedError('Invalid or expired token'));
    }
  }
}