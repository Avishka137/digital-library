const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key-change-this-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  console.log('Auth Header:', authHeader);
  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    console.log('Decoded user:', decoded);
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  console.log('Checking admin role for user:', req.user);
  
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'User not authenticated' 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }

  next();
};

// Export with both naming conventions for compatibility
module.exports = { 
  authenticateToken, 
  isAdmin,
  protect: authenticateToken,  // Alias for authenticateToken
  admin: isAdmin,               // Alias for isAdmin
  SECRET_KEY 
};