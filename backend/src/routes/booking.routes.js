import express from 'express';
import { 
  createBooking, 
  getBookings, 
  getBooking, 
  updateBooking, 
  cancelBooking, 
  getAvailableSlots 
} from '../controllers/booking.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';
import { check } from 'express-validator';

const router = express.Router();

// Public routes
router.get('/availability/:date', getAvailableSlots);

// Protected routes (require authentication)
router.use(protect);

// Create a new booking
router.post(
  '/',
  [
    check('service', 'Please select a valid service').isIn([
      'Vehicle Inspection',
      'New Car Consultation',
      'Rental Property Inspection',
      'Holiday Accommodation Inspection'
    ]),
    check('date', 'Please select a valid date').isISO8601().toDate(),
    check('time', 'Please select a valid time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    check('user.fullName', 'Please enter your full name').notEmpty(),
    check('user.email', 'Please include a valid email').isEmail(),
    check('user.phone', 'Please include a valid phone number').notEmpty(),
  ],
  upload.array('documents', 5), // Allow up to 5 document uploads
  createBooking
);

// Get all bookings (for admin) or user's own bookings
router.get('/', getBookings);

// Get single booking
router.get('/:id', getBooking);

// Update booking
router.put(
  '/:id',
  [
    check('date', 'Please select a valid date')
      .optional()
      .isISO8601()
      .toDate(),
    check('time', 'Please select a valid time')
      .optional()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    check('status')
      .optional()
      .isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])
  ],
  updateBooking
);

// Cancel booking
router.delete(
  '/:id',
  [
    check('reason', 'Please provide a reason for cancellation')
      .optional()
      .isLength({ min: 10 })
  ],
  cancelBooking
);

// Admin routes
router.use(authorize('admin'));

// Admin-only routes can be added here

// Example admin route to get all bookings (including other users')
router.get('/admin/all', getBookings);

export default router;
