import express from 'express';
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

// Static files (serve from backend/public)
app.use(express.static(path.join(__dirname, '../public')));

// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
import inspectionRoutes from './routes/inspection.routes.js';
import bookingRoutes from './routes/booking.routes.js';

// app.use('/api/users', userRoutes);
// app.use('/api/services', serviceRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/bookings', bookingRoutes);

// Handle 404 - must be after all other routes
app.use(notFound);

// Global error handler - must be after all other middleware
app.use(errorHandler);

export default app;
