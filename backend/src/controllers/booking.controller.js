import Booking from '../models/booking.model.js';

export const createBooking = async (req, res) => {
  try {
    const { fullName, email, phone, carModel, budget, neededBy, additionalNotes } = req.body;
    
    const booking = new Booking({
      fullName,
      email,
      phone,
      carModel,
      budget,
      neededBy,
      additionalNotes,
      images: req.files ? req.files.map(file => file.path) : []
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};
