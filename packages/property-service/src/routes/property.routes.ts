import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PropertyController } from '../controllers/property.controller';
import { validate, validateQuery } from '../middleware/validation.middleware';
import {
  createPropertySchema,
  updatePropertySchema,
  propertyQuerySchema,
} from '../middleware/property.validation';
import { authenticate } from '../middleware/auth.middleware';

// Router pentru property endpoints
// Similar cu @RequestMapping("/properties") în Spring Boot

export function createPropertyRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const propertyController = new PropertyController(prisma);

  // POST /properties (necesită autentificare)
  router.post(
    '/',
    authenticate,
    validate(createPropertySchema),
    propertyController.create.bind(propertyController)
  );

  // GET /properties/search (public)
  router.get(
    '/search',
    validateQuery(propertyQuerySchema),
    propertyController.search.bind(propertyController)
  );

  // GET /properties/my-properties (necesită autentificare)
  // IMPORTANT: Trebuie definită ÎNAINTE de /:id pentru că Express evaluează rutele în ordine
  router.get(
    '/my-properties',
    authenticate,
    propertyController.getMyProperties.bind(propertyController)
  );

  // GET /properties/:id (public)
  router.get(
    '/:id',
    propertyController.findById.bind(propertyController)
  );

  // PUT /properties/:id (necesită autentificare)
  router.put(
    '/:id',
    authenticate,
    validate(updatePropertySchema),
    propertyController.update.bind(propertyController)
  );

  // DELETE /properties/:id (necesită autentificare)
  router.delete(
    '/:id',
    authenticate,
    propertyController.delete.bind(propertyController)
  );

  return router;
} 