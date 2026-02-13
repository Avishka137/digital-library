const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    
    // Create default admin user after connection
    await createDefaultAdmin();
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    
    console.log('Trying alternative connection...');
    try {
      const altUri = process.env.MONGO_URI.replace('mongodb+srv://', 'mongodb://');
      const conn = await mongoose.connect(altUri);
      console.log(`✅ MongoDB connected (alternative): ${conn.connection.host}`);
      
      await createDefaultAdmin();
      
      return conn;
    } catch (altError) {
      console.error(`❌ Alternative connection also failed: ${altError.message}`);
      process.exit(1);
    }
  }
};

// Create default admin user
async function createDefaultAdmin() {
  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    
    // Check if admin exists
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = new User({
        username: 'admin',
        email: 'admin@library.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active'
      });
      
      await admin.save();
      console.log('👤 Default admin user created (username: admin, password: admin123)');
    }
  } catch (error) {
    console.error('Error creating default admin:', error.message);
  }
}

module.exports = connectDB;