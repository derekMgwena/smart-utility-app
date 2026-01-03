const express = require('express');
const { Appliance } = require('../models/Appliance');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// Get all appliances
router.get('/', async (req, res) => {
  try {
    let appliances = await Appliance.find({ userId: req.user.id, isActive: true });
    
    // Create default appliances if none exist
    if (appliances.length === 0) {
      const defaults = [
        {
          userId: req.user.id, name: 'Washing Machine', type: 'washing_machine',
          category: 'appliances', specifications: { powerRating: 2200 }, status: { isOn: false }
        },
        {
          userId: req.user.id, name: 'Fridge', type: 'refrigerator',
          category: 'appliances', specifications: { powerRating: 150 }, status: { isOn: true }
        },
        {
          userId: req.user.id, name: 'Geyser', type: 'geyser',
          category: 'heating', specifications: { powerRating: 3000 }, status: { isOn: true }
        },
        {
          userId: req.user.id, name: 'Pool Pump', type: 'pool_pump',
          category: 'pumps', specifications: { powerRating: 1100 }, status: { isOn: false }
        }
      ];
      
      appliances = await Appliance.create(defaults);
    }
    
    res.json({ success: true, data: appliances });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error getting appliances' });
  }
});

// Toggle appliance
router.put('/:id/toggle', async (req, res) => {
  try {
    const appliance = await Appliance.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!appliance) {
      return res.status(404).json({ success: false, message: 'Appliance not found' });
    }
    
    appliance.status.isOn = !appliance.status.isOn;
    await appliance.save();
    
    res.json({ 
      success: true, 
      message: `Appliance ${appliance.status.isOn ? 'turned on' : 'turned off'}`,
      data: appliance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error toggling appliance' });
  }
});

module.exports = router;