import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Books.css';

const Books = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryFromUrl = searchParams.get('category');

  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'All');
  const [categories] = useState(['All', 'Religious', 'Psychology', 'Novels', 'Science', 'History', 'Biography']);

  // Update selected category when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('All');
    }
  }, [categoryFromUrl]);

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter books using useCallback to prevent infinite loops
  const filterBooksByCategory = useCallback(() => {
    if (selectedCategory === 'All') {
      setBooks(allBooks);
    } else {
      const filtered = allBooks.filter(book => book.category === selectedCategory);
      setBooks(filtered);
    }
  }, [selectedCategory, allBooks]);

  // Filter books whenever category or allBooks changes
  useEffect(() => {
    filterBooksByCategory();
  }, [filterBooksByCategory]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      
      if (data.success) {
        setAllBooks(data.data || []);
        setSelectedBooks(new Set());
      } else {
        setError('Failed to fetch books');
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedBooks(new Set());
    if (category === 'All') {
      navigate('/books');
    } else {
      navigate(`/books?category=${encodeURIComponent(category)}`);
    }
  };

  const handleDownload = (bookId, filename) => {
    if (filename) {
      window.open(`http://localhost:5000/uploads/books/${filename}`, '_blank');
    } else {
      alert('PDF file not available for this book');
    }
  };

  const toggleSelectBook = (bookId) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBooks(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedBooks.size === books.length && books.length > 0) {
      setSelectedBooks(new Set());
    } else {
      const allIds = new Set(books.map((book) => book._id));
      setSelectedBooks(allIds);
    }
  };

  const handleDeleteBook = async (bookId) => {
    const book = books.find(b => b._id === bookId);
    
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          setAllBooks(allBooks.filter((b) => b._id !== bookId));
          setSelectedBooks(new Set(
            Array.from(selectedBooks).filter(id => id !== bookId)
          ));
          alert('✅ Book deleted successfully');
        } else {
          alert('❌ Failed to delete book: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('❌ Error deleting book. Please try again.');
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBooks.size === 0) {
      alert('Please select at least one book to delete');
      return;
    }

    const count = selectedBooks.size;
    if (window.confirm(`Delete ${count} selected book${count !== 1 ? 's' : ''}? This action cannot be undone.`)) {
      try {
        const idsArray = Array.from(selectedBooks);
        
        const response = await fetch('http://localhost:5000/api/books/delete/multiple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ids: idsArray })
        });

        const data = await response.json();

        if (data.success) {
          await fetchBooks();
          setSelectedBooks(new Set());
          alert(`✅ Successfully deleted ${data.deleted} book(s)`);
        } else {
          alert('❌ Failed to delete books: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error deleting books:', err);
        alert('❌ Error deleting books. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="books-container">
        <div className="books-header">
          <h1>📚 All Books</h1>
        </div>
        <div className="loading">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="books-container">
        <div className="books-header">
          <h1>📚 All Books</h1>
        </div>
        <div className="error-message">
          ❌ {error}
          <button onClick={fetchBooks} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="books-container">
      <div className="books-header">
        <h1>📚 {selectedCategory === 'All' ? 'All Books' : `${selectedCategory} Books`}</h1>
        <p className="books-count">
          {books.length === 0 
            ? selectedCategory !== 'All' 
              ? `No books in ${selectedCategory} category` 
              : 'No books uploaded yet'
            : `${books.length} book${books.length !== 1 ? 's' : ''} ${selectedCategory !== 'All' ? `in ${selectedCategory}` : 'in library'}`}
        </p>
      </div>

      {selectedCategory !== 'All' && (
        <div className="active-filter-badge">
          <span className="filter-icon">🔖</span>
          <span>Filtered by: <strong>{selectedCategory}</strong></span>
          <button 
            onClick={() => handleCategoryChange('All')}
            className="clear-filter-btn-badge"
            title="Clear filter"
          >
            ✖️
          </button>
        </div>
      )}

      <div className="category-filter-section">
        <div className="category-filter-scroll">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
              {category !== 'All' && (
                <span className="category-count">
                  {allBooks.filter(b => b.category === category).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {books.length > 0 && (
        <div className="bulk-actions">
          <div className="selection-info">
            <input 
              type="checkbox" 
              id="select-all"
              checked={selectedBooks.size === books.length && books.length > 0}
              onChange={toggleSelectAll}
              className="select-all-checkbox"
            />
            <label htmlFor="select-all">
              {selectedBooks.size === 0 
                ? `Select all ${selectedCategory !== 'All' ? selectedCategory + ' ' : ''}books` 
                : `${selectedBooks.size} book${selectedBooks.size !== 1 ? 's' : ''} selected`}
            </label>
          </div>

          {selectedBooks.size > 0 && (
            <div className="action-buttons">
              <button 
                onClick={handleDeleteSelected}
                className="btn-delete-selected"
              >
                🗑️ Delete Selected ({selectedBooks.size})
              </button>
              <button 
                onClick={() => setSelectedBooks(new Set())}
                className="btn-cancel-selection"
              >
                ✖️ Clear Selection
              </button>
            </div>
          )}
        </div>
      )}

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <h2>No Books {selectedCategory !== 'All' ? `in ${selectedCategory}` : 'Yet'}</h2>
          <p>
            {selectedCategory !== 'All' 
              ? `There are no books in the ${selectedCategory} category yet.`
              : 'Start building your digital library by uploading your first book!'}
          </p>
          {selectedCategory !== 'All' ? (
            <button 
              onClick={() => handleCategoryChange('All')}
              className="view-all-btn-empty"
            >
              📚 View All Books
            </button>
          ) : (
            <a href="/add-book" className="upload-link">
              ➕ Upload Book
            </a>
          )}
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div 
              key={book._id} 
              className={`book-card ${selectedBooks.has(book._id) ? 'selected' : ''}`}
            >
              <div className="book-selection">
                <input 
                  type="checkbox"
                  checked={selectedBooks.has(book._id)}
                  onChange={() => toggleSelectBook(book._id)}
                  className="book-checkbox"
                />
              </div>

              <div className="book-cover">
                {book.coverFilename ? (
                  <img 
                    src={`http://localhost:5000/uploads/covers/${book.coverFilename}`}
                    alt={book.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="book-cover-placeholder" style={{ display: book.coverFilename ? 'none' : 'flex' }}>
                  📚
                </div>
              </div>
              
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">✍️ {book.author}</p>
                
                <div className="book-meta">
                  {book.category && (
                    <span className="book-category">🏷️ {book.category}</span>
                  )}
                  {book.publishedYear && (
                    <span className="book-year">📅 {book.publishedYear}</span>
                  )}
                  {book.pages && (
                    <span className="book-pages">📄 {book.pages} pages</span>
                  )}
                </div>

                {book.description && (
                  <p className="book-description">{book.description}</p>
                )}

                <div className="book-actions">
                  <button 
                    onClick={() => handleDownload(book._id, book.pdfFilename)}
                    className="btn-primary"
                    disabled={!book.pdfFilename}
                  >
                    📖 Read Book
                  </button>
                  <button 
                    onClick={() => handleDeleteBook(book._id)}
                    className="btn-danger"
                    title="Delete this book"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;