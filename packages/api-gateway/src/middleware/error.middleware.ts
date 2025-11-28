import { Request, Response, NextFunction } from 'express';

// Global Error Handler pentru API Gateway
// Similar cu @ControllerAdvice în Spring

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Dacă eroarea are status code (de la serviciile backend)
  if (err.status) {
     res.status(err.status).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.status,
      },
     });
     return;
  }

  // Eroare neașteptată
  console.error('Gateway error:', err);
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      statusCode: 500,
    },
  });
};