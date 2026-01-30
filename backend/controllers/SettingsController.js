// settingsController.js
// Backend controller for managing library settings

const Settings = require('../models/Settings'); // Adjust path as needed

// @desc    Get library settings
// @route   GET /api/settings
// @access  Admin only
exports.getSettings = async (req, res) => {
  try {
    // Get settings from database
    // Assuming there's only one settings document
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await Settings.create({
        libraryName: 'VIKLIB',
        maxBorrowDays: 14,
        maxBooksPerUser: 5,
        lateFeesEnabled: true,
        lateFeePerDay: 1.00,
        emailNotifications: true,
        reminderDaysBefore: 3,
        allowReservations: true,
        autoRenewEnabled: false,
        theme: 'light'
      });
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

// @desc    Update library settings
// @route   PUT /api/settings
// @access  Admin only
exports.updateSettings = async (req, res) => {
  try {
    const {
      libraryName,
      maxBorrowDays,
      maxBooksPerUser,
      lateFeesEnabled,
      lateFeePerDay,
      emailNotifications,
      reminderDaysBefore,
      allowReservations,
      autoRenewEnabled,
      theme
    } = req.body;

    // Validation
    if (maxBorrowDays && (maxBorrowDays < 1 || maxBorrowDays > 90)) {
      return res.status(400).json({
        success: false,
        message: 'Max borrow days must be between 1 and 90'
      });
    }

    if (maxBooksPerUser && (maxBooksPerUser < 1 || maxBooksPerUser > 20)) {
      return res.status(400).json({
        success: false,
        message: 'Max books per user must be between 1 and 20'
      });
    }

    if (lateFeePerDay && lateFeePerDay < 0) {
      return res.status(400).json({
        success: false,
        message: 'Late fee cannot be negative'
      });
    }

    if (reminderDaysBefore && (reminderDaysBefore < 1 || reminderDaysBefore > 7)) {
      return res.status(400).json({
        success: false,
        message: 'Reminder days must be between 1 and 7'
      });
    }

    // Find and update settings (assuming single settings document)
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create new settings if none exist
      settings = await Settings.create(req.body);
    } else {
      // Update existing settings
      settings = await Settings.findOneAndUpdate(
        {},
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

// @desc    Reset settings to default
// @route   POST /api/settings/reset
// @access  Admin only
exports.resetSettings = async (req, res) => {
  try {
    const defaultSettings = {
      libraryName: 'VIKLIB',
      maxBorrowDays: 14,
      maxBooksPerUser: 5,
      lateFeesEnabled: true,
      lateFeePerDay: 1.00,
      emailNotifications: true,
      reminderDaysBefore: 3,
      allowReservations: true,
      autoRenewEnabled: false,
      theme: 'light'
    };

    const settings = await Settings.findOneAndUpdate(
      {},
      defaultSettings,
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Settings reset to default',
      data: settings
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting settings',
      error: error.message
    });
  }
};

module.exports = exports;