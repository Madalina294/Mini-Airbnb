import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors.utils';

// Middleware pentru validare cu Zod
// Similar cu @Valid și Bean Validation în Spring

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(new BadRequestError(`Validation failed: ${JSON.stringify(errors)}`));
      }
      next(error);
    }
  };
};