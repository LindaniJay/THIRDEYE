import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    carModel: { type: String, required: true },
    budget: { type: Number, required: true },
    neededBy: { type: Date, required: true },
    additionalNotes: String,
    images: [String],
    status: { 
      type: String, 
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
