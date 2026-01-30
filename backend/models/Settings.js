// Settings.js - Mongoose Model
// Model for storing library settings in MongoDB

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  libraryName: {
    type: String,
    required: [true, 'Library name is required'],
    default: 'VIKLIB',
    maxlength: [100, 'Library name cannot exceed 100 characters']
  },
  maxBorrowDays: {
    type: Number,
    required: [true, 'Max borrow days is required'],
    default: 14,
    min: [1, 'Max borrow days must be at least 1'],
    max: [90, 'Max borrow days cannot exceed 90']
  },
  maxBooksPerUser: {
    type: Number,
    required: [true, 'Max books per user is required'],
    default: 5,
    min: [1, 'Max books per user must be at least 1'],
    max: [20, 'Max books per user cannot exceed 20']
  },
  lateFeesEnabled: {
    type: Boolean,
    default: true
  },
  lateFeePerDay: {
    type: Number,
    default: 1.00,
    min: [0, 'Late fee cannot be negative']
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  reminderDaysBefore: {
    type: Number,
    default: 3,
    min: [1, 'Reminder days must be at least 1'],
    max: [7, 'Reminder days cannot exceed 7']
  },
  allowReservations: {
    type: Boolean,
    default: true
  },
  autoRenewEnabled: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'light'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);