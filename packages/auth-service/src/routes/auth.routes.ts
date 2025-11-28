import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../middleware/auth.validation';

// Router pentru auth endpoints
// Similar cu @RequestMapping("/auth") în Spring Boot

export function createAuthRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const authController = new AuthController(prisma);

  // POST /auth/register
  router.post(
    '/register',
    validate(registerSchema),
    authController.register.bind(authController)  // ← Adaugă .bind()
  );

  // POST /auth/login
  router.post(
    '/login',
    validate(loginSchema),
    authController.login.bind(authController)  // ← Adaugă .bind()
  );

  // POST /auth/validate
  router.post(
    '/validate',
    authController.validate.bind(authController)  // ← Adaugă .bind()
  );

  return router;
}