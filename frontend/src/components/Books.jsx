import React, { useState, useEffect } from 'react';
import './Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      
      if (data.success) {
        setBooks(data.books || []);
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
    window.open(`http://localhost:5000/uploads/books/${filename}`, '_blank');
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
          {books.map((book, index) => (
            <div key={index} className="book-card">
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
                    onClick={() => handleDownload(index, book.pdfFilename)}
                    className="btn-primary"
                  >
                    📖 Read Book
                  </button>
                  <button className="btn-secondary">
                    📥 Download
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