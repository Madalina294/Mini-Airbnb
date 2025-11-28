import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.utils';

// Global Error Handler
// Similar cu @ControllerAdvice în Spring

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  // Eroare neașteptată
  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      statusCode: 500,
    },
  });
};