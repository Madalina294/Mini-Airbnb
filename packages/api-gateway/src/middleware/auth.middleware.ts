import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware pentru validare JWT
// Similar cu @PreAuthorize sau Security Filter în Spring

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extrage token-ul din header
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
    const secret = process.env.JWT_SECRET || 'default-secret';

    // Verifică și decodează token-ul
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
      role: string;
    };

    // Adaugă informațiile user-ului în request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired token',
        statusCode: 401,
      },
    });
  }
};

// Middleware opțional (pentru endpoint-uri care nu necesită autentificare obligatorie)
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const secret = process.env.JWT_SECRET || 'default-secret';
      const decoded = jwt.verify(token, secret) as {
        userId: string;
        email: string;
        role: string;
      };
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }
    next();
  } catch (error) {
    // Continuă fără autentificare dacă token-ul este invalid
    next();
  }
};