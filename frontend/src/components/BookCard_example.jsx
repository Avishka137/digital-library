// Example: How to update your BookCard.jsx to hide admin buttons from regular users

import React from 'react';
import { isAdmin } from '../utils/auth'; // Import the utility
import './BookCard.css';

const BookCard = ({ book, onDelete, onRefresh }) => {
  const userIsAdmin = isAdmin(); // Check if current user is admin

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/books/${book._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Book deleted successfully!');
        if (onDelete) onDelete(book._id);
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || 'Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Error deleting book');
    }
  };

  return (
    <div className="book-card">
      <div className="book-cover">
        {book.coverFilename ? (
          <img 
            src={`http://localhost:5000/uploads/covers/${book.coverFilename}`}
            alt={book.title}
          />
        ) : (
          <div className="no-cover">📚</div>
        )}
      </div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        
        {book.category && (
          <span className="book-category">{book.category}</span>
        )}

        <div className="book-actions">
          {/* View/Read button - Available to ALL users */}
          <button className="btn-view">
            📖 Read
          </button>

          {/* Borrow button - Available to ALL authenticated users */}
          <button className="btn-borrow">
            📚 Borrow
          </button>

          {/* Edit button - ADMIN ONLY */}
          {userIsAdmin && (
            <button className="btn-edit">
              ✏️ Edit
            </button>
          )}

          {/* Delete button - ADMIN ONLY */}
          {userIsAdmin && (
            <button 
              className="btn-delete"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;