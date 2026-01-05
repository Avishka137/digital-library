import React from 'react';
import './BookCard.css';

const BookCard = ({ book, onEdit, onDelete, isAdmin }) => {
  const handleView = () => {
    const details = `
Title: ${book.title}
Author: ${book.author}
ISBN: ${book.isbn || 'N/A'}
Publisher: ${book.publisher || 'N/A'}
Year: ${book.year || 'N/A'}
Category: ${book.category || 'N/A'}
Copies: ${book.copies_available}/${book.copies_total}
Description: ${book.description || 'No description available'}
    `.trim();
    
    alert(details);
  };

  return (
    <div className="book-card">
      <div className="book-cover">
        {book.cover_url ? (
          <img 
            src={book.cover_url} 
            alt={book.title}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="default-cover" style={{ display: book.cover_url ? 'none' : 'flex' }}>
          📚
        </div>
      </div>
      
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        
        {book.category && (
          <span className="book-category">{book.category}</span>
        )}
        
        <p className="book-copies">
          Available: {book.copies_available}/{book.copies_total}
        </p>
        
        <div className="book-actions">
          <button onClick={handleView} className="btn-sm btn-info">
            View
          </button>
          {isAdmin && (
            <>
              <button onClick={() => onEdit(book)} className="btn-sm btn-warning">
                Edit
              </button>
              <button onClick={() => onDelete(book.id)} className="btn-sm btn-danger">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;