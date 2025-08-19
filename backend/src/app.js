import express from 'express';
import 'express-async-errors';
import { setupSecurity } from './middleware/security.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { connectDB } from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize express app
const app = express();

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Security middleware
setupSecurity(app);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

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

// app.use('/api/users', userRoutes);
// app.use('/api/services', serviceRoutes);
app.use('/api/inspections', inspectionRoutes);

// Handle 404 - must be after all other routes
app.all('*', notFound);

// Global error handler - must be after all other middleware
app.use(errorHandler);

export default app;
