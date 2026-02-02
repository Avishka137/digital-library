const express = require('express');
const router = express.Router();

// Sample books data - replace with database queries later
const sampleBooks = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    category: 'Fiction',
    description: 'A classic American novel set in the Jazz Age.',
    coverUrl: '/uploads/covers/gatsby.jpg',
    pdfUrl: '/uploads/books/gatsby.pdf',
    publishedDate: '1925-04-10',
    pages: 180,
    rating: 4.5
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0061120084',
    category: 'Fiction',
    description: 'A gripping tale of racial injustice in the American South.',
    coverUrl: '/uploads/covers/mockingbird.jpg',
    pdfUrl: '/uploads/books/mockingbird.pdf',
    publishedDate: '1960-07-11',
    pages: 281,
    rating: 4.8
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    category: 'Dystopian Fiction',
    description: 'A dystopian novel about totalitarianism and surveillance.',
    coverUrl: '/uploads/covers/1984.jpg',
    pdfUrl: '/uploads/books/1984.pdf',
    publishedDate: '1949-06-08',
    pages: 328,
    rating: 4.7
  }
];

// Get all books
router.get('/', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Books fetched successfully',
      data: sampleBooks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message
    });
  }
});

// Get book by ID
router.get('/:id', (req, res) => {
  try {
    const book = sampleBooks.find(b => b.id === parseInt(req.params.id));
    
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

// Create new book
router.post('/', (req, res) => {
  try {
    const { title, author, isbn, category, description, publishedDate, pages } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: 'Title and author are required'
      });
    }
    
    const newBook = {
      id: sampleBooks.length + 1,
      title,
      author,
      isbn,
      category,
      description,
      publishedDate,
      pages,
      rating: 0
    };
    
    sampleBooks.push(newBook);
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating book',
      error: error.message
    });
  }
});

// Update book
router.put('/:id', (req, res) => {
  try {
    const book = sampleBooks.find(b => b.id === parseInt(req.params.id));
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    // Update book properties
    Object.assign(book, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating book',
      error: error.message
    });
  }
});

// Delete book
router.delete('/:id', (req, res) => {
  try {
    const index = sampleBooks.findIndex(b => b.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    const deletedBook = sampleBooks.splice(index, 1);
    
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: deletedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting book',
      error: error.message
    });
  }
});

module.exports = router;