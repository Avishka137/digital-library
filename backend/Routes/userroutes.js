const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    // Format users to match frontend expectations
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.username || user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role.charAt(0).toUpperCase() + user.role.slice(1), // Capitalize role
      location: user.location || '',
      avatar: user.avatar || '',
      color: user.color || 'blue',
      borrowedBooks: user.borrowedBooks || 0,
      createdAt: user.createdAt
    }));
    
    res.json({
      success: true,
      users: formattedUsers,
      total: formattedUsers.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// @route   POST /api/users
// @desc    Create new user (Admin only)
// @access  Private/Admin
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, role, location, color } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      username: name,
      name: name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: (role || 'Member').toLowerCase(),
      location: location || '',
      color: color || 'blue',
      avatar: generateAvatar(name)
    });
    
    await newUser.save();
    
    // Return user without password
    const userResponse = {
      id: newUser._id.toString(),
      name: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1),
      location: newUser.location,
      color: newUser.color,
      avatar: newUser.avatar,
      borrowedBooks: 0
    };
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private/Admin
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, role, location, color } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update fields
    if (name) user.username = name;
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role.toLowerCase();
    if (location !== undefined) user.location = location;
    if (color) user.color = color;
    
    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    // Update avatar
    if (name) {
      user.avatar = generateAvatar(name);
    }
    
    await user.save();
    
    const userResponse = {
      id: user._id.toString(),
      name: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      location: user.location,
      color: user.color,
      avatar: user.avatar
    };
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Prevent deleting yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

// Helper function to generate avatar initials
function generateAvatar(name) {
  if (!name) return 'NA';
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

module.exports = router;