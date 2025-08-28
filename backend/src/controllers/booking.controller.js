import Booking from '../models/booking.model.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import User from '../models/user.model.js';
import Email from '../utils/email.js';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Add user to req.body
  req.body.user = req.user.id;

  // Check for existing booking at the same time
  const existingBooking = await Booking.findOne({
    date: req.body.date,
    time: req.body.time,
    status: { $ne: 'cancelled' }
  });

  if (existingBooking) {
    return next(
      new ErrorResponse(
        'The selected time slot is no longer available. Please choose another time.',
        400
      )
    );
  }

  const booking = await Booking.create(req.body);

  // Get user with email
  const user = await User.findById(req.user.id);

  // Send confirmation email
  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/bookings/${booking._id}`;
    await new Email(user, resetUrl).sendBookingConfirmation(booking);
  } catch (err) {
    console.error('Error sending booking confirmation email:', err);
    // Don't fail the request if email fails
  }

  res.status(201).json({
    success: true,
    data: booking,
  });
});

// @desc    Get all bookings (with filtering, sorting, and pagination)
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = asyncHandler(async (req, res, next) => {
  try {
    const { status, dateFrom, dateTo, sortBy = '-createdAt', page = 1, limit = 10 } = req.query;

    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    // For non-admin users, only show their own bookings
    if (req.user?.role !== 'admin') {
      query['user.userId'] = req.user?.id;
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: bookings.length,
      total,
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    next(new ErrorResponse('Error fetching bookings', 500));
  }
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = asyncHandler(async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid booking ID', 400));
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new ErrorResponse('Booking not found', 404));
    }

    // Check if user has permission to view this booking
    if (req.user?.role !== 'admin' && booking.user.userId?.toString() !== req.user?.id) {
      return next(new ErrorResponse('Not authorized to view this booking', 403));
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    next(new ErrorResponse('Error fetching booking', 500));
  }
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this booking`, 401));
  }

  // Check for time slot availability if date or time is being updated
  if (req.body.date || req.body.time) {
    const date = req.body.date || booking.date;
    const time = req.body.time || booking.time;

    const existingBooking = await Booking.findOne({
      _id: { $ne: req.params.id },
      date,
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return next(new ErrorResponse('The selected time slot is no longer available. Please choose another time.', 400));
    }
  }

  // Store old status for comparison
  const oldStatus = booking.status;

  // Update booking
  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Get user with email
  const user = await User.findById(booking.user);

  // Send update email if status changed or important fields were updated
  if (oldStatus !== booking.status || req.body.date || req.body.time) {
    try {
      const resetUrl = `${req.protocol}://${req.get('host')}/bookings/${booking._id}`;
      await new Email(user, resetUrl).sendBookingUpdate(booking);
    } catch (err) {
      console.error('Error sending booking update email:', err);
      // Don't fail the request if email fails
    }
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
      reason,
      cancelledBy: req.user?.id || null,
      cancelledAt: new Date()
    };
    
    await booking.save();
    
    // TODO: Uncomment when email service is set up
    // await sendBookingUpdateEmail(booking, 'cancelled');
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error cancelling booking', 
      error: error.message 
    });
  }
};

// @desc    Get available time slots for a date
// @route   GET /api/bookings/availability/:date
// @access  Public
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const selectedDate = new Date(date);
    
    // Check if date is valid
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid date format' 
      });
    }
    
    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.json({ 
        success: true,
        data: { availableSlots: [] } 
      });
    }
    
    // Generate all possible time slots (9 AM to 4 PM, 1-hour slots)
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      allSlots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: true
      });
    }
    
    // Get all bookings for the selected date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const bookings = await Booking.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' }
    });
    
    // Mark booked slots as unavailable
    const bookedSlots = bookings.map(booking => booking.time.split(':')[0]);
    
    const availableSlots = allSlots.map(slot => ({
      ...slot,
      available: !bookedSlots.includes(slot.time.split(':')[0])
    }));
    
    res.json({ 
      success: true,
      data: { availableSlots } 
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching available slots', 
      error: error.message 
    });
  }
};

// Helper function to get service price
const getServicePrice = (service) => {
  const prices = {
    'Vehicle Inspection': 800,
    'New Car Consultation': 500,
    'Rental Property Inspection': 600,
    'Holiday Accommodation Inspection': 700
  };
  
  return prices[service] || 0;
};
