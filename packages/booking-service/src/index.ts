import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createBookingRoutes } from './routes/booking.routes';
import { errorHandler } from './middleware/error.middleware';

// Încarcă variabilele de mediu
dotenv.config();

// Entry Point - similar cu Application.java în Spring Boot
const app = express();
const PORT = process.env.PORT_BOOKING || 3003;

// Prisma Client (singleton)
const prisma = new PrismaClient();

// Middleware pentru parsing JSON
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Booking Service is running',
  });
});

// Routes
app.use('/bookings', createBookingRoutes(prisma));

// Error Handler (trebuie să fie ultimul middleware!)
app.use(errorHandler);

// Pornește serverul
app.listen(PORT, () => {
  console.log(`🚀 Booking Service running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing Prisma connection...');
  await prisma.$disconnect();
  process.exit(0);
});

