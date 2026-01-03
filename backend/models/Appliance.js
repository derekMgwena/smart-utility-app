const mongoose = require('mongoose');

const applianceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Appliance name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  type: {
    type: String,
    required: true,
    enum: [
      'washing_machine', 'dryer', 'dishwasher',
      'refrigerator', 'freezer',
      'geyser', 'water_heater',
      'air_conditioner', 'heater', 'fan',
      'pool_pump', 'irrigation_system',
      'oven', 'microwave', 'kettle',
      'tv', 'computer', 'lights',
      'other'
    ]
  },
  category: {
    type: String,
    enum: ['heating', 'cooling', 'appliances', 'lighting', 'pumps', 'entertainment', 'other'],
    required: true
  },
  specifications: {
    powerRating: {
      type: Number,
      required: true,
      min: [1, 'Power rating must be at least 1 watt']
    },
    voltage: {
      type: Number,
      default: 230
    },
    brand: String,
    model: String,
    yearPurchased: Number,
    energyRating: {
      type: String,
      enum: ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'unknown'],
      default: 'unknown'
    }
  },
  status: {
    isOn: { type: Boolean, default: false },
    isConnected: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
    health: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor', 'maintenance_required'],
      default: 'good'
    }
  },
  schedule: {
    enabled: { type: Boolean, default: false },
    timezone: { type: String, default: 'Africa/Johannesburg' },
    rules: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'daily', 'weekdays', 'weekends']
      },
      startTime: String, // HH:mm format
      endTime: String,   // HH:mm format
      action: {
        type: String,
        enum: ['on', 'off', 'auto']
      },
      isActive: { type: Boolean, default: true }
    }]
  },
  automation: {
    loadSheddingMode: {
      enabled: { type: Boolean, default: false },
      priority: {
        type: String,
        enum: ['critical', 'high', 'medium', 'low'],
        default: 'medium'
      },
      autoOff: { type: Boolean, default: false },
      autoOn: { type: Boolean, default: false }
    },
    smartMode: {
      enabled: { type: Boolean, default: false },
      rules: [{
        condition: String, // e.g., "time_of_use", "electricity_price", "load_shedding"
        action: String,    // e.g., "turn_off", "reduce_power", "schedule_later"
        threshold: mongoose.Schema.Types.Mixed
      }]
    }
  },
  usage: {
    totalHours: { type: Number, default: 0 },
    totalEnergy: { type: Number, default: 0 }, // kWh
    totalCost: { type: Number, default: 0 },
    averageHoursPerDay: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now },
    peakUsageHour: Number // 0-23
  },
  location: {
    room: String,
    zone: String,
    coordinates: {
      x: Number,
      y: Number
    }
  },
  notifications: {
    maintenance: {
      enabled: { type: Boolean, default: true },
      intervalMonths: { type: Number, default: 6 },
      lastNotified: Date
    },
    highUsage: {
      enabled: { type: Boolean, default: false },
      thresholdHours: { type: Number, default: 8 }
    }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const applianceUsageLogSchema = new mongoose.Schema({
  applianceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appliance',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  action: {
    type: String,
    enum: ['turned_on', 'turned_off', 'power_changed', 'scheduled', 'maintenance'],
    required: true
  },
  powerUsage: {
    type: Number,
    min: [0, 'Power usage cannot be negative']
  },
  duration: {
    type: Number, // minutes
    min: [0, 'Duration cannot be negative']
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  trigger: {
    type: String,
    enum: ['manual', 'scheduled', 'automation', 'load_shedding', 'smart_mode'],
    default: 'manual'
  },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for performance
applianceSchema.index({ userId: 1, isActive: 1 });
applianceSchema.index({ type: 1, category: 1 });
applianceUsageLogSchema.index({ applianceId: 1, timestamp: -1 });
applianceUsageLogSchema.index({ userId: 1, timestamp: -1 });

// Update timestamp on save
applianceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.status.lastUpdated = Date.now();
  next();
});

// Calculate estimated hourly cost
applianceSchema.virtual('estimatedHourlyCost').get(function() {
  const powerInKW = this.specifications.powerRating / 1000;
  const electricityRate = 1.60; // R1.60 per kWh (average SA rate)
  return powerInKW * electricityRate;
});

// Calculate estimated daily cost (assuming 8 hours usage)
applianceSchema.virtual('estimatedDailyCost').get(function() {
  return this.estimatedHourlyCost * 8;
});

// Check if appliance is currently scheduled to be on
applianceSchema.methods.isScheduledOn = function(date = new Date()) {
  if (!this.schedule.enabled || !this.schedule.rules.length) return false;
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[date.getDay()];
  const currentTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
  return this.schedule.rules.some(rule => {
    if (!rule.isActive) return false;
    
    // Check day match
    const dayMatch = rule.day === currentDay || 
                    rule.day === 'daily' ||
                    (rule.day === 'weekdays' && [1,2,3,4,5].includes(date.getDay())) ||
                    (rule.day === 'weekends' && [0,6].includes(date.getDay()));
    
    if (!dayMatch) return false;
    
    // Check time match
    return currentTime >= rule.startTime && currentTime <= rule.endTime && rule.action === 'on';
  });
};

module.exports = {
  Appliance: mongoose.model('Appliance', applianceSchema),
  ApplianceUsageLog: mongoose.model('ApplianceUsageLog', applianceUsageLogSchema)
};