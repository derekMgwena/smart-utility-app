const express = require('express');
const { WaterAccount } = require('../models/Water');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// Get water account
router.get('/account', async (req, res) => {
  try {
    let account = await WaterAccount.findOne({ userId: req.user.id });
    
    if (!account) {
      account = await WaterAccount.create({
        userId: req.user.id,
        tankInfo: { capacity: 1000, currentLevel: 600 }
      });
    }
    
    res.json({ success: true, data: account });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error getting water account' });
  }
});

// Update water level
router.put('/level', async (req, res) => {
  try {
    const { currentLevel } = req.body;
    
    const account = await WaterAccount.findOneAndUpdate(
      { userId: req.user.id },
      { 'tankInfo.currentLevel': currentLevel },
      { new: true }
    );
    
    res.json({ success: true, data: account });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating water level' });
  }
});

// Top up water
router.post('/topup', async (req, res) => {
  try {
    const { volume, amount } = req.body;
    
    let account = await WaterAccount.findOne({ userId: req.user.id });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Water account not found' });
    }
    
    const newLevel = Math.min(
      account.tankInfo.currentLevel + volume,
      account.tankInfo.capacity
    );
    
    account.tankInfo.currentLevel = newLevel;
    await account.save();
    
    res.json({ success: true, message: 'Water top-up successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing water top-up' });
  }
});

module.exports = router;