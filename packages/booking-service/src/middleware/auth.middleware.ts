import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

// Middleware pentru validare JWT prin Auth Service
// Similar cu @PreAuthorize în Spring Boot

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Token is required',
          statusCode: 401,
        },
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    // Validează token-ul prin Auth Service
    const response = await axios.post(
      `${authServiceUrl}/auth/validate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Adaugă informațiile user-ului în request
    req.user = {
      userId: response.data.data.userId,
      email: response.data.data.email,
      role: response.data.data.role,
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired token',
        statusCode: 401,
      },
    });
  }
};