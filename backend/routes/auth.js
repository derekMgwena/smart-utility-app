const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ElectricityAccount } = require('../models/Electricity');
const { WaterAccount } = require('../models/Water');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'household'
    });
    
    // Create default electricity account
    const electricityAccount = await ElectricityAccount.create({
      userId: user._id,
      accountNumber: `ELC${user._id.toString().slice(-8).toUpperCase()}`,
      currentBalance: 0
    });
    
    // Create default water account
    const waterAccount = await WaterAccount.create({
      userId: user._id,
      tankInfo: {
        capacity: 1000, // 1000L default
        currentLevel: 600 // 60% full
      }
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.getSafeData()
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.getSafeData()
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user.getSafeData()
    });
    
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user data'
    });
  }
};

// @desc    Demo login (for development/testing)
// @route   POST /api/auth/demo
// @access  Public
const demoLogin = async (req, res) => {
  try {
    // Check if demo user exists, create if not
    let demoUser = await User.findOne({ email: 'demo@smartutility.com' });
    
    if (!demoUser) {
      // Create demo user
      demoUser = await User.create({
        name: 'Demo User',
        email: 'demo@smartutility.com',
        password: 'demo123',
        role: 'household',
        isEmailVerified: true
      });
      
      // Create demo accounts
      await ElectricityAccount.create({
        userId: demoUser._id,
        accountNumber: 'DEMO001',
        currentBalance: 145.3
      });
      
      await WaterAccount.create({
        userId: demoUser._id,
        tankInfo: {
          capacity: 1000,
          currentLevel: 600
        }
      });
    }
    
    // Generate token
    const token = generateToken(demoUser._id);
    
    res.status(200).json({
      success: true,
      message: 'Demo login successful',
      token,
      user: demoUser.getSafeData()
    });
    
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error with demo login'
    });
  }
};

// Routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/demo', demoLogin);

// Protected routes (require auth middleware)
const { protect } = require('../middleware/auth');
router.get('/me', protect, getMe);

module.exports = router;