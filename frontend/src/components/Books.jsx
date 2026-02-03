import React, { useState, useEffect } from 'react';
import './Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState(new Set());

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      
      if (data.success) {
        setBooks(data.data || []);
        setSelectedBooks(new Set()); // Clear selection when refreshing
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

  const handleDownload = (bookId, filename) => {
    if (filename) {
      window.open(`http://localhost:5000/uploads/books/${filename}`, '_blank');
    } else {
      alert('PDF file not available for this book');
    }
  };

  // Toggle individual book selection
  const toggleSelectBook = (bookId) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBooks(newSelected);
  };

  // Toggle select all books
  const toggleSelectAll = () => {
    if (selectedBooks.size === books.length) {
      setSelectedBooks(new Set());
    } else {
      const allIds = new Set(books.map((book) => book._id));
      setSelectedBooks(allIds);
    }
  };

  // Delete single book
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
          setBooks(books.filter((b) => b._id !== bookId));
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

  // Delete selected books
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
          // Refresh books list
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
        <h1>📚 All Books</h1>
        <p className="books-count">
          {books.length === 0 
            ? 'No books uploaded yet' 
            : `${books.length} book${books.length !== 1 ? 's' : ''} in library`}
        </p>
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
                ? 'Select all books' 
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
          <h2>No Books Yet</h2>
          <p>Start building your digital library by uploading your first book!</p>
          <a href="/add-book" className="upload-link">
            ➕ Upload Book
          </a>
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