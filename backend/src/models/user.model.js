import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Cascade delete bookings when a user is deleted
userSchema.pre('remove', async function(next) {
  console.log(`Bookings being removed for user ${this._id}`);
  await this.model('Booking').deleteMany({ user: this._id });
  next();
});

// Create a text index for searching
userSchema.index({ name: 'text', email: 'text' });

// Ensure email is unique
userSchema.index({ email: 1 }, { unique: true });

// Virtual for user's full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to get user's initials
userSchema.methods.getInitials = function() {
  return this.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

// Static method to get users by role
userSchema.statics.getUsersByRole = async function(role) {
  return await this.find({ role });
};

// Method to get user's bookings
userSchema.methods.getUserBookings = async function() {
  return await mongoose.model('Booking').find({ user: this._id });
};

// Method to check if user has admin role
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

export default mongoose.model('User', userSchema);
