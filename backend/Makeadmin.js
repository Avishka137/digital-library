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
    
    // Make the first user admin (or specify email)
    const emailToMakeAdmin = users[0].email; // Change this to specific email if needed
    
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
      console.log(`${index + 1}. ${user.username || 'No name'} (${user.email}) - Role: ${user.role}`);
    });
    
    await mongoose.connection.close();
    console.log('\n🔒 Done!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

makeAdmin();