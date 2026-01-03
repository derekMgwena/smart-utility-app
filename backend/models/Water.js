const mongoose = require('mongoose');

const waterUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  volumeUsed: {
    type: Number,
    required: true,
    min: [0, 'Volume used cannot be negative']
  },
  cost: {
    type: Number,
    required: true,
    min: [0, 'Cost cannot be negative']
  },
  rate: {
    type: Number,
    required: true,
    min: [0, 'Rate cannot be negative']
  },
  readingType: {
    type: String,
    enum: ['manual', 'automatic', 'estimated'],
    default: 'manual'
  },
  meterReading: Number,
  source: {
    type: String,
    enum: ['municipal', 'borehole', 'rainwater', 'other'],
    default: 'municipal'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const waterAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  tankInfo: {
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Tank capacity must be at least 1 liter']
    },
    currentLevel: {
      type: Number,
      required: true,
      min: [0, 'Current level cannot be negative'],
      validate: {
        validator: function(v) {
          return v <= this.tankInfo.capacity;
        },
        message: 'Current level cannot exceed tank capacity'
      }
    },
    lastRefill: {
      date: Date,
      amount: Number,
      cost: Number
    }
  },
  monthlyBudget: {
    type: Number,
    default: 500,
    min: [0, 'Budget cannot be negative']
  },
  alerts: {
    lowLevel: {
      enabled: { type: Boolean, default: true },
      threshold: { type: Number, default: 20 } // percentage of tank capacity
    },
    highUsage: {
      enabled: { type: Boolean, default: true },
      threshold: { type: Number, default: 80 } // percentage of monthly budget
    },
    qualityCheck: {
      enabled: { type: Boolean, default: false },
      intervalDays: { type: Number, default: 30 }
    }
  },
  waterQuality: {
    lastTested: Date,
    pH: Number,
    tds: Number, // Total Dissolved Solids
    chlorine: Number,
    status: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor', 'unknown'],
      default: 'unknown'
    }
  },
  statistics: {
    averageDailyUsage: Number,
    averageMonthlyUsage: Number,
    averageMonthlyCost: Number,
    lastUpdated: Date
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const waterTopUpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WaterAccount',
    required: true
  },
  volume: {
    type: Number,
    required: true,
    min: [1, 'Volume must be at least 1 liter']
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Top-up amount must be at least 1']
  },
  rate: {
    type: Number,
    required: true,
    min: [0, 'Rate cannot be negative']
  },
  supplier: {
    name: String,
    type: {
      type: String,
      enum: ['municipal', 'private', 'delivery'],
      default: 'municipal'
    }
  },
  deliveryInfo: {
    address: String,
    scheduledDate: Date,
    deliveredDate: Date,
    driverInfo: {
      name: String,
      phone: String,
      vehicleNumber: String
    }
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'mobile_money', 'cash', 'cod'],
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivering', 'delivered', 'cancelled', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for performance
waterUsageSchema.index({ userId: 1, date: -1 });
waterUsageSchema.index({ date: -1 });
waterAccountSchema.index({ userId: 1 });
waterTopUpSchema.index({ userId: 1, createdAt: -1 });

// Update timestamp on save
[waterUsageSchema, waterAccountSchema, waterTopUpSchema].forEach(schema => {
  schema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
});

// Calculate percentage level
waterAccountSchema.virtual('levelPercentage').get(function() {
  if (!this.tankInfo.capacity || this.tankInfo.capacity === 0) return 0;
  return Math.round((this.tankInfo.currentLevel / this.tankInfo.capacity) * 100);
});

// Virtual for remaining capacity
waterAccountSchema.virtual('remainingCapacity').get(function() {
  return this.tankInfo.capacity - this.tankInfo.currentLevel;
});

module.exports = {
  WaterUsage: mongoose.model('WaterUsage', waterUsageSchema),
  WaterAccount: mongoose.model('WaterAccount', waterAccountSchema),
  WaterTopUp: mongoose.model('WaterTopUp', waterTopUpSchema)
};