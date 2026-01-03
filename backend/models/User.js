const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['household', 'industry'],
    default: 'household'
  },
  profile: {
    avatar: String,
    phone: String,
    address: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: { type: String, default: 'South Africa' }
    }
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      lowBalance: { type: Boolean, default: true },
      highUsage: { type: Boolean, default: true },
      loadShedding: { type: Boolean, default: true }
    },
    currency: { type: String, default: 'ZAR' },
    timezone: { type: String, default: 'Africa/Johannesburg' }
  },
  subscription: {
    type: {
      type: String,
      enum: ['basic', 'premium'],
      default: 'basic'
    },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true }
  },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get safe user data (excluding sensitive fields)
userSchema.methods.getSafeData = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);