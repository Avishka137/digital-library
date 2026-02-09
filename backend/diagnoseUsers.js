require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);
  }
};

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

async function diagnose() {
  try {
    await connectDB();
    
    console.log('🔍 VIKLIB User Diagnostics\n');
    console.log('='.repeat(80));
    
    // Check total users
    const totalUsers = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${totalUsers}\n`);
    
    if (totalUsers === 0) {
      console.log('❌ No users found! You need to register at least one user.\n');
      console.log('💡 Go to http://localhost:3000/register and create an account\n');
      await mongoose.connection.close();
      return;
    }
    
    // Get all users
    const users = await User.find();
    
    console.log('👥 Users in database:\n');
    console.log('─'.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User Details:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Username: ${user.username || user.name || 'N/A'}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role || 'NOT SET ⚠️'}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log(`   Location: ${user.location || 'N/A'}`);
      console.log(`   Created: ${user.createdAt || 'N/A'}`);
    });
    
    console.log('\n' + '─'.repeat(80));
    
    // Check for admin
    const adminUsers = users.filter(u => u.role === 'admin');
    
    if (adminUsers.length === 0) {
      console.log('\n⚠️  NO ADMIN USERS FOUND!\n');
      console.log('💡 This is why the Users page is empty - you need admin access.\n');
      console.log('🔧 To fix this, run: node makeAdmin.js\n');
    } else {
      console.log(`\n✅ Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach(admin => {
        console.log(`   • ${admin.username || admin.email} (${admin.email})`);
      });
      console.log('\n💡 Make sure you\'re logged in as one of these admin users!\n');
    }
    
    console.log('='.repeat(80));
    console.log('\n📋 Summary:');
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Admin Users: ${adminUsers.length}`);
    console.log(`   Regular Users: ${totalUsers - adminUsers.length}`);
    
    console.log('\n🔑 Next Steps:');
    if (adminUsers.length === 0) {
      console.log('   1. Run: node makeAdmin.js');
      console.log('   2. Logout from your app');
      console.log('   3. Login again');
      console.log('   4. Go to Users page');
    } else {
      console.log('   1. Make sure you\'re logged in as an admin');
      console.log('   2. Check browser console (F12) for errors');
      console.log('   3. Verify backend is running on port 5000');
    }
    
    console.log('\n');
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

diagnose();