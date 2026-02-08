require('dotenv').config();
const mongoose = require('mongoose');

// Import your existing DB connection config
const connectDB = async () => {
  try {
    // Connect without deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/viklib');
    return conn;
  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);
  }
};

// Simple Book Schema (same as your model)
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  isbn: String,
  description: String,
  publishedYear: Number,
  pages: Number,
  coverFilename: String,
  pdfFilename: String,
  rating: Number
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

async function fixCategories() {
  try {
    console.log('\n' + '='.repeat(80));
    console.log('📚 VIKLIB Category Fixer');
    console.log('   Self-Help → Psychology Migration Tool');
    console.log('='.repeat(80) + '\n');

    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected successfully!\n');

    // Step 1: Show current state
    console.log('🔍 Analyzing your current books...\n');
    const allBooks = await Book.find({});
    
    if (allBooks.length === 0) {
      console.log('❌ No books found in database!\n');
      console.log('💡 Make sure your backend is using the correct database.');
      await mongoose.connection.close();
      return;
    }

    // Show all categories
    const uniqueCategories = [...new Set(allBooks.map(b => b.category))];
    console.log('📋 Current categories in your database:');
    console.log('─'.repeat(80));
    uniqueCategories.forEach(cat => {
      const count = allBooks.filter(b => b.category === cat).length;
      console.log(`   • "${cat}" - ${count} book${count === 1 ? '' : 's'}`);
    });
    console.log('─'.repeat(80) + '\n');

    // Step 2: Find Self-Help books
    const selfHelpBooks = await Book.find({
      category: /self-help/i  // Case-insensitive regex
    });

    if (selfHelpBooks.length === 0) {
      console.log('❌ No "Self-Help" books found!\n');
      console.log('💡 Your books might already be updated or use a different category name.');
      console.log('📋 Check the category list above to see what categories exist.\n');
      await mongoose.connection.close();
      return;
    }

    // Step 3: Show what will be updated
    console.log(`✅ Found ${selfHelpBooks.length} Self-Help book${selfHelpBooks.length === 1 ? '' : 's'}:\n`);
    selfHelpBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}"`);
      console.log(`   📖 Author: ${book.author}`);
      console.log(`   🏷️  Current Category: "${book.category}"`);
      console.log('');
    });

    console.log('─'.repeat(80));
    console.log('\n🔄 Updating categories to "Psychology"...\n');

    // Step 4: Update ALL variations of Self-Help to Psychology
    const updateResult = await Book.updateMany(
      { category: /self-help/i },
      { $set: { category: 'Psychology' } }
    );

    console.log('✅ Update Complete!');
    console.log(`   📊 Modified: ${updateResult.modifiedCount} book${updateResult.modifiedCount === 1 ? '' : 's'}`);
    console.log(`   🎯 Matched: ${updateResult.matchedCount} book${updateResult.matchedCount === 1 ? '' : 's'}\n`);

    // Step 5: Verify the update
    console.log('🔍 Verifying changes...\n');
    const psychologyBooks = await Book.find({ category: 'Psychology' });
    const remainingSelfHelp = await Book.find({ category: /self-help/i });

    console.log('📊 Final Status:');
    console.log('─'.repeat(80));
    console.log(`✅ Psychology category: ${psychologyBooks.length} book${psychologyBooks.length === 1 ? '' : 's'}`);
    console.log(`⚠️  Self-Help remaining: ${remainingSelfHelp.length} book${remainingSelfHelp.length === 1 ? '' : 's'}`);
    
    if (psychologyBooks.length > 0) {
      console.log('\n📚 Books now in Psychology category:');
      psychologyBooks.forEach((book, index) => {
        console.log(`   ${index + 1}. "${book.title}" by ${book.author}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('✨ SUCCESS! All Self-Help books moved to Psychology category.');
    console.log('─'.repeat(80));
    console.log('\n📝 Next Steps:');
    console.log('   1. Restart your backend server:');
    console.log('      cd backend && npm start');
    console.log('\n   2. Refresh your browser (F5 or Ctrl+R)');
    console.log('\n   3. Click on "Psychology" category to see your books!');
    console.log('\n' + '='.repeat(80) + '\n');

    await mongoose.connection.close();
    console.log('🔒 Database connection closed\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n💡 Common issues:');
    console.error('   1. MongoDB not running - start MongoDB service');
    console.error('   2. Wrong database name in .env file');
    console.error('   3. Network/connection issues\n');
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the fix
fixCategories();