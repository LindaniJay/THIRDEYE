import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { setupSecurity } from './middleware/security.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize express app
const app = express();

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB connection is initiated in server.js to avoid double-connecting

// Security middleware
setupSecurity(app);

// Trust proxy if behind a reverse proxy (e.g., Heroku, AWS ELB, etc.)
app.set('trust proxy', 1);

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Cookie parser
app.use(cookieParser());

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files (serve from backend/public)
app.use(express.static(path.join(__dirname, '../public')));

// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    node: process.version
  });
});

// API routes
import inspectionRoutes from './routes/inspection.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import authRoutes from './routes/auth.routes.js';

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/bookings', bookingRoutes);

// Handle 404 - must be after all other routes
app.use(notFound);

// Global error handler - must be after all other middleware
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

export default app;
