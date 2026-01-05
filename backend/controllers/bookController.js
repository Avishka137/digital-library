const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: books 
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching books',
      error: error.message 
    });
  }
};

// Get single book
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ 
        success: false, 
        message: 'Book not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: book 
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching book',
      error: error.message 
    });
  }
};

// Add new book (Admin only)
const addBook = async (req, res) => {
  console.log('Add book request from user:', req.user);
  console.log('Book data:', req.body);
  console.log('File:', req.file);

  const { 
    title, 
    author, 
    isbn, 
    publisher, 
    year, 
    category, 
    copies, 
    description 
  } = req.body;

  // Validation
  if (!title || !author) {
    return res.status(400).json({ 
      success: false, 
      message: 'Title and author are required' 
    });
  }

  try {
    const copiesTotal = copies || 1;
    
    // Get PDF URL if file was uploaded
    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newBook = await Book.create({
      title,
      author,
      isbn: isbn || undefined,
      publisher: publisher || undefined,
      year: year || undefined,
      category: category || undefined,
      copies_total: copiesTotal,
      copies_available: copiesTotal,
      description: description || undefined,
      pdf_url: pdfUrl
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Book added successfully',
      data: newBook
    });
  } catch (error) {
    console.error('Error adding book:', error);
    
    // Delete uploaded file if book creation failed
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error adding book',
      error: error.message 
    });
  }
};

// Update book (Admin only)
const updateBook = async (req, res) => {
  console.log('Update book request from user:', req.user);
  console.log('Book ID:', req.params.id);
  console.log('Update data:', req.body);
  console.log('File:', req.file);

  const { 
    title, 
    author, 
    isbn, 
    publisher, 
    year, 
    category, 
    copies, 
    description 
  } = req.body;

  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ 
        success: false, 
        message: 'Book not found' 
      });
    }

    // Update fields
    const updateData = {
      title,
      author,
      isbn,
      publisher,
      year,
      category,
      copies_total: copies,
      description
    };

    // If new PDF file uploaded, delete old one and update
    if (req.file) {
      // Delete old PDF file if exists
      if (book.pdf_url) {
        const oldFilePath = path.join(__dirname, '..', book.pdf_url);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.pdf_url = `/uploads/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({ 
      success: true, 
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    console.error('Error updating book:', error);
    
    // Delete uploaded file if update failed
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error updating book',
      error: error.message 
    });
  }
};

// Delete book (Admin only)
const deleteBook = async (req, res) => {
  console.log('Delete book request from user:', req.user);
  console.log('Book ID:', req.params.id);

  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ 
        success: false, 
        message: 'Book not found' 
      });
    }

    // Delete PDF file if exists
    if (book.pdf_url) {
      const filePath = path.join(__dirname, '..', book.pdf_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Book.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Book deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting book',
      error: error.message 
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
};