import express from 'express';
import dotenv from 'dotenv';
import { createAuthRoutes } from './routes/auth.routes';
import { createPropertyRoutes } from './routes/property.routes';  
import { errorHandler } from './middleware/error.middleware';

// Încarcă variabilele de mediu
dotenv.config();

// Entry Point - similar cu Application.java în Spring Boot
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pentru parsing JSON
app.use(express.json());

// CORS (pentru frontend)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Gateway is running',
  });
});

// Routes - toate route-urile vor fi prefixate cu /api
app.use('/api/auth', createAuthRoutes());
app.use('/api/properties', createPropertyRoutes());

// Error Handler (trebuie să fie ultimul middleware!)
app.use(errorHandler);

// Pornește serverul
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});