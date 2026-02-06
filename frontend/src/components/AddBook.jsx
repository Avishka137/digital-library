import React, { useState } from 'react';
import './AddBook.css';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    publishedYear: '',
    language: 'English',
    pages: ''
  });
  
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCoverImage(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pdfFile) {
      alert('Please upload a PDF file');
      return;
    }

    setUploading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('author', formData.author);
    formDataToSend.append('isbn', formData.isbn);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('publishedYear', formData.publishedYear);
    formDataToSend.append('language', formData.language);
    formDataToSend.append('pages', formData.pages);
    formDataToSend.append('pdf', pdfFile);
    if (coverImage) {
      formDataToSend.append('cover', coverImage);
    }

    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('✅ Book uploaded successfully!');
        // Reset form
        setFormData({
          title: '',
          author: '',
          isbn: '',
          category: '',
          description: '',
          publishedYear: '',
          language: 'English',
          pages: ''
        });
        setPdfFile(null);
        setCoverImage(null);
        // Reset file inputs
        document.getElementById('pdf-upload').value = '';
        document.getElementById('cover-upload').value = '';
      } else {
        alert('❌ Failed to upload book: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading book:', error);
      alert('❌ Error uploading book. Make sure backend is running on port 5000!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-book-container">
      <div className="add-book-header">
        <h1>📤 Upload New Book</h1>
        <p>Add a new book to your digital library</p>
      </div>

      <form onSubmit={handleSubmit} className="add-book-form">
        <div className="form-row">
          <div className="form-group">
            <label>Book Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="form-group">
            <label>Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Enter author name"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              placeholder="ISBN number"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select category</option>
              <option value="Religious">Religious</option>
              <option value="Psychology">Psychology</option>
              <option value="Novels">Novels</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Biography">Biography</option>
              <option value="Business">Business</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Published Year</label>
            <input
              type="number"
              name="publishedYear"
              value={formData.publishedYear}
              onChange={handleInputChange}
              placeholder="2024"
              min="1800"
              max="2025"
            />
          </div>

          <div className="form-group">
            <label>Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Number of Pages</label>
            <input
              type="number"
              name="pages"
              value={formData.pages}
              onChange={handleInputChange}
              placeholder="300"
              min="1"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter book description..."
            rows="4"
          />
        </div>

        <div className="upload-section">
          <div className="upload-box">
            <label htmlFor="pdf-upload" className="upload-label">
              <span className="upload-icon">📄</span>
              <h3>Upload PDF File *</h3>
              <p>{pdfFile ? pdfFile.name : 'Click to select PDF'}</p>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handlePdfChange}
                required
              />
            </label>
          </div>

          <div className="upload-box">
            <label htmlFor="cover-upload" className="upload-label">
              <span className="upload-icon">🖼️</span>
              <h3>Upload Cover Image</h3>
              <p>{coverImage ? coverImage.name : 'Click to select image (optional)'}</p>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
              />
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? (
            <>
              <span className="spinner">⏳</span>
              Uploading...
            </>
          ) : (
            <>
              <span>✨</span>
              Upload Book 
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddBook;