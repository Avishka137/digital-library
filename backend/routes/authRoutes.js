const express = require('express');
const router = express.Router();
const { login, register, verifyToken } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected route
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;