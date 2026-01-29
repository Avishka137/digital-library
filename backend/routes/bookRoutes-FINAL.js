const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// In-memory storage for books (will reset when server restarts)
// For production, use a real database
let booksDatabase = [];

// Path to store books data persistently
const booksDataPath = path.join(__dirname, '../data/books.json');

// Load books from file on startup
if (fs.existsSync(booksDataPath)) {
  try {
    const data = fs.readFileSync(booksDataPath, 'utf8');
    booksDatabase = JSON.parse(data);
    console.log(`📚 Loaded ${booksDatabase.length} books from database`);
  } catch (error) {
    console.error('Error loading books database:', error);
  }
} else {
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Function to save books to file
const saveBooksToFile = () => {
  try {
    fs.writeFileSync(booksDataPath, JSON.stringify(booksDatabase, null, 2));
    console.log('💾 Books database saved');
  } catch (error) {
    console.error('Error saving books database:', error);
  }
};

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, '../uploads/books');
const coversDir = path.join(__dirname, '../uploads/covers');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created books upload directory');
}

if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
  console.log('✅ Created covers upload directory');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'pdf') {
      cb(null, uploadsDir);
    } else if (file.fieldname === 'cover') {
      cb(null, coversDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'pdf') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed!'), false);
      }
    } else if (file.fieldname === 'cover') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    } else {
      cb(null, true);
    }
  }
});

// POST /api/books - Upload a new book
router.post('/', upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('📚 Received book upload request');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const { title, author, isbn, category, description, publishedYear, language, pages } = req.body;
    
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const pdfPath = req.files.pdf[0].path;
    const coverPath = req.files.cover ? req.files.cover[0].path : null;

    const bookData = {
      id: Date.now().toString(),
      title,
      author,
      isbn,
      category,
      description,
      publishedYear,
      language,
      pages,
      pdfPath,
      coverPath,
      pdfFilename: req.files.pdf[0].filename,
      coverFilename: req.files.cover ? req.files.cover[0].filename : null,
      uploadedAt: new Date().toISOString()
    };

    // Add to database
    booksDatabase.push(bookData);
    saveBooksToFile();

    console.log('✅ Book uploaded successfully:', bookData.title);
    console.log(`📊 Total books in library: ${booksDatabase.length}`);

    res.status(201).json({
      success: true,
      message: 'Book uploaded successfully!',
      book: bookData
    });

  } catch (error) {
    console.error('❌ Error uploading book:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to upload book',
      message: error.message 
    });
  }
});

// GET /api/books - Get all books
router.get('/', async (req, res) => {
  try {
    console.log(`📚 Fetching all books - Total: ${booksDatabase.length}`);
    res.json({
      success: true,
      message: 'Books retrieved successfully',
      books: booksDatabase,
      count: booksDatabase.length
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch books' 
    });
  }
});

// GET /api/books/:id - Get a single book
router.get('/:id', async (req, res) => {
  try {
    const book = booksDatabase.find(b => b.id === req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    res.json({
      success: true,
      book
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch book' 
    });
  }
});

// DELETE /api/books/:id - Delete a single book
router.delete('/:id', async (req, res) => {
  try {
    const bookIndex = booksDatabase.findIndex(b => b.id === req.params.id);
    
    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    const book = booksDatabase[bookIndex];
    
    // Delete files
    if (fs.existsSync(book.pdfPath)) {
      try {
        fs.unlinkSync(book.pdfPath);
        console.log('🗑️ Deleted PDF file:', book.pdfFilename);
      } catch (fileError) {
        console.error('Error deleting PDF file:', fileError);
      }
    }
    
    if (book.coverPath && fs.existsSync(book.coverPath)) {
      try {
        fs.unlinkSync(book.coverPath);
        console.log('🗑️ Deleted cover file:', book.coverFilename);
      } catch (fileError) {
        console.error('Error deleting cover file:', fileError);
      }
    }

    // Remove from database
    booksDatabase.splice(bookIndex, 1);
    saveBooksToFile();

    console.log('🗑️ Book deleted:', book.title);

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete book' 
    });
  }
});

// POST /api/books/delete/multiple - Delete multiple books
router.post('/delete/multiple', async (req, res) => {
  try {
    console.log('🗑️ Delete multiple books request');
    console.log('IDs to delete:', req.body.ids);

    const { ids } = req.body;

    // Validation
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No book IDs provided'
      });
    }

    let deletedCount = 0;
    let errorCount = 0;
    const deletedBooks = [];

    // Delete each book
    for (const bookId of ids) {
      try {
        const bookIndex = booksDatabase.findIndex(b => b.id === bookId);
        
        if (bookIndex === -1) {
          console.warn(`⚠️ Book not found: ${bookId}`);
          errorCount++;
          continue;
        }

        const book = booksDatabase[bookIndex];

        // Delete files
        if (fs.existsSync(book.pdfPath)) {
          try {
            fs.unlinkSync(book.pdfPath);
            console.log('🗑️ Deleted PDF file:', book.pdfFilename);
          } catch (fileError) {
            console.error('Error deleting PDF file:', fileError);
          }
        }

        if (book.coverPath && fs.existsSync(book.coverPath)) {
          try {
            fs.unlinkSync(book.coverPath);
            console.log('🗑️ Deleted cover file:', book.coverFilename);
          } catch (fileError) {
            console.error('Error deleting cover file:', fileError);
          }
        }

        // Remove from database
        booksDatabase.splice(bookIndex, 1);
        deletedBooks.push(book.title);
        deletedCount++;
        console.log(`✅ Deleted: ${book.title}`);

      } catch (error) {
        console.error(`❌ Error deleting book ${bookId}:`, error);
        errorCount++;
      }
    }

    // Save database after all deletions
    saveBooksToFile();

    console.log(`📊 Delete operation completed - Deleted: ${deletedCount}, Errors: ${errorCount}`);

    res.json({
      success: true,
      message: `Deleted ${deletedCount} book(s), ${errorCount} error(s)`,
      deleted: deletedCount,
      errors: errorCount,
      deletedBooks: deletedBooks,
      totalBooksRemaining: booksDatabase.length
    });

  } catch (error) {
    console.error('Error deleting multiple books:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete books',
      message: error.message
    });
  }
});

module.exports = router;