const express = require('express');
const { ElectricityAccount, ElectricityUsage, ElectricityTopUp } = require('../models/Electricity');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// Get electricity account
router.get('/account', async (req, res) => {
  try {
    let account = await ElectricityAccount.findOne({ userId: req.user.id });
    
    if (!account) {
      account = await ElectricityAccount.create({
        userId: req.user.id,
        accountNumber: `ELC${req.user.id.toString().slice(-8).toUpperCase()}`,
        currentBalance: 145.3
      });
    }
    
    res.json({ success: true, data: account });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error getting electricity account' });
  }
});

// Get usage data
router.get('/usage', async (req, res) => {
  try {
    const usage = await ElectricityUsage.find({ userId: req.user.id }).sort({ date: -1 }).limit(30);
    
    // Generate sample data if none exists
    if (usage.length === 0) {
      const sampleData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        sampleData.push({
          date: date,
          unitsConsumed: 12 + Math.random() * 6,
          cost: 15 + Math.random() * 8,
          rate: 1.6
        });
      }
      return res.json({ success: true, data: sampleData, message: 'Sample data' });
    }
    
    res.json({ success: true, data: usage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error getting usage' });
  }
});

// Top up electricity
router.post('/topup', async (req, res) => {
  try {
    const { amount } = req.body;
    
    let account = await ElectricityAccount.findOne({ userId: req.user.id });
    if (!account) {
      account = await ElectricityAccount.create({
        userId: req.user.id,
        accountNumber: `ELC${req.user.id.toString().slice(-8).toUpperCase()}`,
        currentBalance: 0
      });
    }
    
    const rate = 1.6;
    const units = amount / rate;
    
    account.currentBalance += units;
    await account.save();
    
    res.json({ success: true, message: 'Top-up successful', units });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing top-up' });
  }
});

module.exports = router;