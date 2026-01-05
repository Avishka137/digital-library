import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { booksAPI } from '../services/api';
import './AddBookModal.css';

const AddBookModal = ({ isOpen, onClose, bookToEdit, onSuccess }) => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    year: '',
    category: '',
    copies: 1,
    description: '',
    coverImage: '',
    pdfFile: ''
  });

  // Load book data when editing
  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        isbn: bookToEdit.isbn || '',
        publisher: bookToEdit.publisher || '',
        year: bookToEdit.year || '',
        category: bookToEdit.category || '',
        copies: bookToEdit.copies_total || 1,
        description: bookToEdit.description || '',
        coverImage: bookToEdit.cover_url || '',
        pdfFile: bookToEdit.pdf_url || ''
      });
    } else {
      // Reset form for new book
      setFormData({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        year: '',
        category: '',
        copies: 1,
        description: '',
        coverImage: '',
        pdfFile: ''
      });
    }
    setError('');
  }, [bookToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is admin
    if (!isAdmin()) {
      setError('You must be an admin to perform this action');
      return;
    }

    // Validation
    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Title and author are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Submitting book data:', formData);
      
      let response;
      if (bookToEdit) {
        // Update existing book
        response = await booksAPI.update(bookToEdit.id, formData);
      } else {
        // Create new book
        response = await booksAPI.create(formData);
      }

      console.log('Book saved successfully:', response);
      
      // Show success message
      alert(response.message || 'Book saved successfully!');
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal
      onClose();
      
    } catch (err) {
      console.error('Error saving book:', err);
      setError(err.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{bookToEdit ? 'Edit Book' : 'Add New Book'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter book title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Enter author name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
              />
            </div>

            <div className="form-group">
              <label htmlFor="publisher">Publisher</label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="Enter publisher"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1000"
                max="2100"
                placeholder="Publication year"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Fiction, Science"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="copies">Number of Copies</label>
            <input
              type="number"
              id="copies"
              name="copies"
              value={formData.copies}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter book description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Cover Image URL</label>
            <input
              type="url"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pdfFile">PDF File URL</label>
            <input
              type="url"
              id="pdfFile"
              name="pdfFile"
              value={formData.pdfFile}
              onChange={handleChange}
              placeholder="https://example.com/book.pdf"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (bookToEdit ? 'Update Book' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;