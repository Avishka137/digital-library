const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/digital-library');
    console.log('✅ Connected to MongoDB database');
    
    // Create default admin user
    await createDefaultAdmin();
    
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await User.create({
        username: 'admin',
        email: 'admin@library.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active'
      });
      
      console.log('✅ Default admin user created (username: admin, password: admin123)');
    } else {
      console.log('✅ Default admin user already exists');
    }
  } catch (err) {
    console.error('❌ Error creating default admin:', err.message);
  }
};

module.exports = connectDB;