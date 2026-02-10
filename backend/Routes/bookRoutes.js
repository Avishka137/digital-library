const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/Book');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, '../uploads');
const booksDir = path.join(uploadsDir, 'books');
const coversDir = path.join(uploadsDir, 'covers');

[uploadsDir, booksDir, coversDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'pdf') {
      cb(null, booksDir);
    } else if (file.fieldname === 'cover') {
      cb(null, coversDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files allowed for pdf field'));
    } else if (file.fieldname === 'cover' && !file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files allowed for cover field'));
    } else {
      cb(null, true);
    }
  }
});

// ==========================================
// PUBLIC ROUTES (Anyone can access)
// ==========================================

// Get all books (with optional category filter) - PUBLIC
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    const books = await Book.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: 'Books fetched successfully',
      data: books,
      filter: category || 'All'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message
    });
  }
});

// Get book by ID - PUBLIC
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Book fetched successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching book',
      error: error.message
    });
  }
});

// Get books by category - PUBLIC
router.get('/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const books = await Book.find({ category: categoryName }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: `Books in ${categoryName} category fetched successfully`,
      data: books,
      category: categoryName
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching books by category',
      error: error.message
    });
  }
});

// ==========================================
// PROTECTED ROUTES (Admin only)
// ==========================================

// Create new book - ADMIN ONLY
router.post('/', authenticateToken, isAdmin, upload.fields([
  { name: 'pdf', maxCount: 1 }, 
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author, isbn, category, description, publishedYear, pages } = req.body;
    
    console.log('📚 Admin creating book:', { title, author, admin: req.user.username });
    
    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: 'Title and author are required'
      });
    }

    if (!req.files || !req.files.pdf) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      });
    }

    const pdfFilename = req.files.pdf[0].filename;
    const coverFilename = req.files.cover ? req.files.cover[0].filename : null;

    const newBook = new Book({
      title,
      author,
      isbn,
      category,
      description,
      publishedYear: publishedYear ? parseInt(publishedYear) : null,
      pages: pages ? parseInt(pages) : null,
      pdfFilename,
      coverFilename
    });
    
    await newBook.save();
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating book',
      error: error.message
    });
  }
});

// Update book - ADMIN ONLY
router.put('/:id', authenticateToken, isAdmin, upload.fields([
  { name: 'pdf', maxCount: 1 }, 
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author, isbn, category, description, publishedYear, pages } = req.body;
    
    console.log('📝 Admin updating book:', req.params.id);
    
    let updateData = {
      title,
      author,
      isbn,
      category,
      description,
      publishedYear: publishedYear ? parseInt(publishedYear) : null,
      pages: pages ? parseInt(pages) : null
    };

    // Handle new file uploads
    if (req.files && req.files.pdf) {
      updateData.pdfFilename = req.files.pdf[0].filename;
    }
    if (req.files && req.files.cover) {
      updateData.coverFilename = req.files.cover[0].filename;
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating book',
      error: error.message
    });
  }
});

// Delete book - ADMIN ONLY
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('🗑️ Admin deleting book:', req.params.id);
    
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Delete associated files
    if (book.pdfFilename) {
      const pdfPath = path.join(booksDir, book.pdfFilename);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }
    if (book.coverFilename) {
      const coverPath = path.join(coversDir, book.coverFilename);
      if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
    }
    
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: book
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting book',
      error: error.message
    });
  }
});

// Delete multiple books - ADMIN ONLY
router.post('/delete/multiple', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    
    console.log('🗑️ Admin deleting multiple books:', ids.length);
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid IDs array'
      });
    }
    
    const books = await Book.find({ _id: { $in: ids } });
    
    // Delete associated files
    books.forEach(book => {
      if (book.pdfFilename) {
        const pdfPath = path.join(booksDir, book.pdfFilename);
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      }
      if (book.coverFilename) {
        const coverPath = path.join(coversDir, book.coverFilename);
        if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
      }
    });

    const result = await Book.deleteMany({ _id: { $in: ids } });
    
    res.status(200).json({
      success: true,
      message: 'Books deleted successfully',
      deleted: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting books:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting books',
      error: error.message
    });
  }
});

module.exports = router;