const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Define User Schema (same as your project)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// Admin credentials - CHANGE THESE TO YOUR DESIRED CREDENTIALS
const ADMIN_CREDENTIALS = {
  username: 'admin',
  email: 'admin@digitallibrary.com',
  password: 'admin123456' // ⚠️ CHANGE THIS TO A STRONG PASSWORD!
};

async function createAdminUser() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: ADMIN_CREDENTIALS.username });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Existing admin:', {
        username: existingAdmin.username,
        email: existingAdmin.email,
        role: existingAdmin.role,
        status: existingAdmin.status
      });
      
      // Optionally reset the password
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Do you want to reset the admin password? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes') {
          const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);
          existingAdmin.password = hashedPassword;
          await existingAdmin.save();
          console.log('✓ Admin password reset successfully!');
          console.log('New credentials:', {
            username: ADMIN_CREDENTIALS.username,
            password: ADMIN_CREDENTIALS.password
          });
        }
        rl.close();
        process.exit(0);
      });
      return;
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);

    // Create admin user
    const adminUser = await User.create({
      username: ADMIN_CREDENTIALS.username,
      email: ADMIN_CREDENTIALS.email,
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    console.log('\n✓ Admin user created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('LOGIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Username: ${ADMIN_CREDENTIALS.username}`);
    console.log(`Password: ${ADMIN_CREDENTIALS.password}`);
    console.log(`Email:    ${ADMIN_CREDENTIALS.email}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

// Run the function
createAdminUser();