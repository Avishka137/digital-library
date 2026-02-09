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

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  role: String
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function makeAdmin() {
  try {
    await connectDB();
    
    console.log('📋 Current users:\n');
    const users = await User.find().select('username email role');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username || 'No name'} (${user.email}) - Role: ${user.role || 'none'}`);
    });
    
    if (users.length === 0) {
      console.log('\n❌ No users found in database!');
      process.exit(0);
    }
    
    // ✨ CHANGED THIS LINE - Make avishka an admin
    const emailToMakeAdmin = 'avishka@gmail.com';
    
    const result = await User.updateOne(
      { email: emailToMakeAdmin },
      { $set: { role: 'admin' } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`\n✅ User "${emailToMakeAdmin}" is now an admin!`);
    } else {
      console.log(`\n⚠️  User might already be an admin or not found`);
    }
    
    // Show updated users
    console.log('\n📋 Updated users:\n');
    const updatedUsers = await User.find().select('username email role');
    updatedUsers.forEach((user, index) => {
      const roleIcon = user.role === 'admin' ? '👑' : '👤';
      console.log(`${index + 1}. ${roleIcon} ${user.username || 'No name'} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Logout from your app');
    console.log('   2. Login as avishka@gmail.com');
    console.log('   3. Go to Users page - it will work now! 🎉\n');
    
    await mongoose.connection.close();
    console.log('🔒 Done!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

makeAdmin();