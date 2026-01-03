const mongoose = require('mongoose');

const electricityUsageSchema = new mongoose.Schema({
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
  meterReading: {
    type: Number,
    required: true,
    min: [0, 'Meter reading cannot be negative']
  },
  unitsConsumed: {
    type: Number,
    required: true,
    min: [0, 'Units consumed cannot be negative']
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
  appliances: [{
    applianceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appliance'
    },
    usage: Number,
    cost: Number
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const electricityAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  currentBalance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  lastMeterReading: {
    value: Number,
    date: Date,
    type: { type: String, enum: ['manual', 'automatic', 'estimated'] }
  },
  monthlyBudget: {
    type: Number,
    default: 1000,
    min: [0, 'Budget cannot be negative']
  },
  tariffPlan: {
    type: String,
    enum: ['standard', 'time-of-use', 'prepaid'],
    default: 'prepaid'
  },
  alerts: {
    lowBalance: {
      enabled: { type: Boolean, default: true },
      threshold: { type: Number, default: 50 }
    },
    highUsage: {
      enabled: { type: Boolean, default: true },
      threshold: { type: Number, default: 80 } // percentage of monthly budget
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

const electricityTopUpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ElectricityAccount',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Top-up amount must be at least 1']
  },
  units: {
    type: Number,
    required: true,
    min: [0, 'Units cannot be negative']
  },
  rate: {
    type: Number,
    required: true,
    min: [0, 'Rate cannot be negative']
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'mobile_money', 'cash'],
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  token: String, // Electricity token for prepaid
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for performance
electricityUsageSchema.index({ userId: 1, date: -1 });
electricityUsageSchema.index({ date: -1 });
electricityAccountSchema.index({ userId: 1 });
electricityAccountSchema.index({ accountNumber: 1 });
electricityTopUpSchema.index({ userId: 1, createdAt: -1 });

// Update timestamp on save
[electricityUsageSchema, electricityAccountSchema, electricityTopUpSchema].forEach(schema => {
  schema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
});

module.exports = {
  ElectricityUsage: mongoose.model('ElectricityUsage', electricityUsageSchema),
  ElectricityAccount: mongoose.model('ElectricityAccount', electricityAccountSchema),
  ElectricityTopUp: mongoose.model('ElectricityTopUp', electricityTopUpSchema)
};