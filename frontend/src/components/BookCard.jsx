import React, { useState } from 'react';
import './BookCard.css';

const BookCard = ({ book, onDelete, onRefresh }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // ⭐ IMPORTANT: Files are in subdirectories!
  // PDFs are in: uploads/books/
  // Covers are in: uploads/covers/

  // Get cover image URL
  const getCoverUrl = () => {
    if (book.coverFilename) {
      return `http://localhost:5000/uploads/covers/${book.coverFilename}`;
    }
    return null;
  };

  // Get PDF URL
  const getPdfUrl = () => {
    if (book.pdfFilename) {
      return `http://localhost:5000/uploads/books/${book.pdfFilename}`;
    }
    return null;
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Religious': '#9b59b6',
      'Psychology': '#16a085',
      'Novels': '#27ae60',
      'Science': '#e74c3c',
      'History': '#f39c12',
      'Biography': '#5b5fd8',
      'Business': '#3498db'
    };
    return colors[category] || '#10b981';
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'Religious': '🕌',
      'Psychology': '🧠',
      'Novels': '📖',
      'Science': '🔬',
      'History': '🕰️',
      'Biography': '👤',
      'Business': '💼'
    };
    return icons[category] || '📚';
  };

  // Handle Read Book
  const handleReadBook = () => {
    const pdfUrl = getPdfUrl();
    console.log('Opening PDF:', pdfUrl); // Debug log
    
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      alert('❌ PDF file not available for this book.\n\nThis book was uploaded without a PDF file.');
    }
  };

  // Handle Delete Book
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/books/${book._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('✅ Book deleted successfully!');
        if (onDelete) {
          onDelete(book._id);
        }
        if (onRefresh) {
          onRefresh();
        }
      } else {
        alert('❌ Failed to delete book: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('❌ Error deleting book. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const coverUrl = getCoverUrl();
  const categoryColor = getCategoryColor(book.category);

  return (
    <div className="book-card-wrapper">
      {/* Book Cover Section */}
      <div className="book-cover-area">
        {coverUrl ? (
          <img 
            src={coverUrl} 
            alt={book.title}
            className="book-cover-img"
            onError={(e) => {
              console.error('Failed to load cover:', coverUrl);
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback placeholder */}
        <div 
          className="book-placeholder"
          style={{ 
            display: coverUrl ? 'none' : 'flex',
            background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`
          }}
        >
          <div className="placeholder-inner">
            <span className="placeholder-emoji">{getCategoryIcon(book.category)}</span>
            <h3 className="placeholder-text">{book.title}</h3>
          </div>
        </div>

        {/* Category Badge */}
        {book.category && (
          <div 
            className="category-tag"
            style={{ backgroundColor: categoryColor }}
          >
            {book.category}
          </div>
        )}
      </div>

      {/* Book Info Section */}
      <div className="book-details">
        <h3 className="book-name">{book.title}</h3>
        <p className="book-writer">by {book.author}</p>

        {/* Book Metadata */}
        <div className="book-metadata">
          {book.publishedYear && (
            <span className="meta-tag">📅 {book.publishedYear}</span>
          )}
          {book.pages && (
            <span className="meta-tag">📄 {book.pages} pages</span>
          )}
          {book.isbn && (
            <span className="meta-tag">🔢 {book.isbn}</span>
          )}
        </div>

        {/* Book Description */}
        {book.description && (
          <p className="book-desc">
            {book.description.length > 120 
              ? `${book.description.substring(0, 120)}...` 
              : book.description
            }
          </p>
        )}

        {/* Action Buttons */}
        <div className="book-buttons">
          <button 
            className="btn-read"
            onClick={handleReadBook}
            title="Read this book"
          >
            <span>📖</span>
            Read Book
          </button>
          
          <button 
            className="btn-remove"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete this book"
          >
            <span>{isDeleting ? '⏳' : '🗑️'}</span>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;