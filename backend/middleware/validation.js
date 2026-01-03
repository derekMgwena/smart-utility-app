const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
exports.validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['household', 'industry'])
    .withMessage('Role must be either household or industry')
];

// User login validation
exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Electricity usage validation
exports.validateElectricityUsage = [
  body('meterReading')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Meter reading must be a positive number'),
  body('unitsConsumed')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Units consumed must be a positive number'),
  body('cost')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number'),
  body('rate')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Rate must be a positive number'),
  body('readingType')
    .optional()
    .isIn(['manual', 'automatic', 'estimated'])
    .withMessage('Reading type must be manual, automatic, or estimated')
];

// Water usage validation
exports.validateWaterUsage = [
  body('volumeUsed')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Volume used must be a positive number'),
  body('cost')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number'),
  body('rate')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Rate must be a positive number'),
  body('source')
    .optional()
    .isIn(['municipal', 'borehole', 'rainwater', 'other'])
    .withMessage('Source must be municipal, borehole, rainwater, or other')
];

// Appliance validation
exports.validateAppliance = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Appliance name must be between 1 and 50 characters'),
  body('type')
    .isIn([
      'washing_machine', 'dryer', 'dishwasher',
      'refrigerator', 'freezer',
      'geyser', 'water_heater',
      'air_conditioner', 'heater', 'fan',
      'pool_pump', 'irrigation_system',
      'oven', 'microwave', 'kettle',
      'tv', 'computer', 'lights',
      'other'
    ])
    .withMessage('Invalid appliance type'),
  body('category')
    .isIn(['heating', 'cooling', 'appliances', 'lighting', 'pumps', 'entertainment', 'other'])
    .withMessage('Invalid appliance category'),
  body('specifications.powerRating')
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('Power rating must be at least 1 watt')
];

// Top-up validation
exports.validateTopUp = [
  body('amount')
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('Amount must be at least 1'),
  body('paymentMethod')
    .isIn(['card', 'bank_transfer', 'mobile_money', 'cash', 'cod'])
    .withMessage('Invalid payment method')
];