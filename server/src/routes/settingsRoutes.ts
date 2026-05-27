import express from 'express';
import Settings from '../models/Settings';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Get settings (we assume there's only one settings document for the whole app)
router.get('/', protect, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
    });
  }
});

// Update settings
router.put('/', protect, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    const updatedSettings = await Settings.findByIdAndUpdate(
      settings._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      settings: updatedSettings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
    });
  }
});

export default router;
