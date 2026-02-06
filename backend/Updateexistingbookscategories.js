// updateExistingBooksCategories.js
// Run this script to add categories to your existing books

const mongoose = require('mongoose');
const Book = require('./models/Book'); // Adjust path if needed

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/digital-library', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

async function updateBooks() {
  try {
    console.log('🔍 Fetching all books without categories...');
    
    // Find books without a category or with empty category
    const booksWithoutCategory = await Book.find({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: '' }
      ]
    });

    console.log(`📚 Found ${booksWithoutCategory.length} books without categories`);

    if (booksWithoutCategory.length === 0) {
      console.log('✅ All books already have categories!');
      process.exit(0);
    }

    // Display books and let you assign categories
    console.log('\n📋 Books without categories:');
    booksWithoutCategory.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author}`);
    });

    // You can manually update categories here
    // Example: Assign default category to all
    const defaultCategory = 'Novels';
    
    for (const book of booksWithoutCategory) {
      book.category = defaultCategory;
      await book.save();
      console.log(`✅ Updated: "${book.title}" → ${defaultCategory}`);
    }

    console.log('\n✅ All books have been updated with categories!');
    
  } catch (error) {
    console.error('❌ Error updating books:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the update
updateBooks();