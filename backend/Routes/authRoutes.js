const express = require('express');
const router = express.Router();
const {
  login,
  register,
  verifyToken
} = require('../controllers/authController');

const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;