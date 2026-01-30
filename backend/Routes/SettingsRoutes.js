const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  resetSettings
} = require('../controllers/settingsController');


// Routes
router.route('/')
  .get(getSettings)     
  .put(updateSettings); 

router.post('/reset', resetSettings);  

module.exports = router;