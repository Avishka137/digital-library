const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try connecting with retryWrites disabled first
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    
    // Try alternative connection
    console.log('Trying alternative connection...');
    try {
      const altUri = process.env.MONGO_URI.replace('mongodb+srv://', 'mongodb://');
      const conn = await mongoose.connect(altUri);
      console.log(`✅ MongoDB connected (alternative): ${conn.connection.host}`);
      return conn;
    } catch (altError) {
      console.error(`❌ Alternative connection also failed: ${altError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;