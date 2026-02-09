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

async function makeAvishkaAdmin() {
  try {
    await connectDB();
    
    console.log('🔧 Making avishka an admin...\n');
    
    const result = await User.updateOne(
      { email: 'avishka@gmail.com' },
      { $set: { role: 'admin' } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ SUCCESS! avishka@gmail.com is now an admin!\n');
    } else {
      console.log('⚠️  User was already admin or email not found\n');
    }
    
    // Show all users
    console.log('📋 All users:\n');
    const users = await User.find().select('username email role');
    users.forEach((user, index) => {
      const roleIcon = user.role === 'admin' ? '👑' : '👤';
      console.log(`${index + 1}. ${roleIcon} ${user.username || 'No name'} (${user.email}) - ${user.role}`);
    });
    
    console.log('\n🎯 Next steps:');
    console.log('   1. Logout from your app');
    console.log('   2. Login as avishka@gmail.com');
    console.log('   3. Go to Users page');
    console.log('   4. You should now see all users! 🎉\n');
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

makeAvishkaAdmin();