import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    service: { 
      type: String, 
      required: true,
      enum: ['Vehicle Inspection', 'New Car Consultation', 'Rental Property Inspection', 'Holiday Accommodation Inspection']
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    user: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      fullName: { type: String, required: true },
      email: { 
        type: String, 
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
      },
      phone: { 
        type: String, 
        required: true,
        match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, 'Please use a valid phone number']
      },
      address: {
        street: String,
        city: String,
        postalCode: String,
        country: String
      }
    },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    payment: {
      amount: { type: Number, required: true },
      currency: { type: String, default: 'ZAR' },
      status: { 
        type: String, 
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
      },
      paymentMethod: String,
      transactionId: String,
      paidAt: Date
    },
    notes: String,
    documents: [{
      name: String,
      url: String,
      type: String
    }],
    inspectionReport: {
      url: String,
      completedAt: Date,
      inspector: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      }
    },
    cancellation: {
      reason: String,
      cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      cancelledAt: Date
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster querying
bookingSchema.index({ date: 1, time: 1 });
bookingSchema.index({ 'user.userId': 1 });
bookingSchema.index({ status: 1 });

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pre-save hook to validate booking time
bookingSchema.pre('save', function(next) {
  const bookingTime = new Date(this.date);
  const [hours, minutes] = this.time.split(':').map(Number);
  
  bookingTime.setHours(hours, minutes, 0, 0);
  
  // Check if booking is during working hours
  if (hours < 8 || hours >= 17) {
    return next(new Error('Bookings are only available between 8 AM and 5 PM'));
  }
  
  // Check if booking is on a weekend
  if ([0, 6].includes(bookingTime.getDay())) {
    return next(new Error('Bookings are not available on weekends'));
  }
  
  next();
});

export default mongoose.model('Booking', bookingSchema);
