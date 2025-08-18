import express from 'express';
import { createBooking, getBookings } from '../controllers/booking.controller.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Create a new booking with file upload
router.post('/', upload.array('images', 5), createBooking);

// Get all bookings (for admin)
router.get('/', getBookings);

export default router;
