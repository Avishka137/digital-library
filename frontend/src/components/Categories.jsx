import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Categories.css';

const Categories = () => {
  const navigate = useNavigate();
  const [bookCounts, setBookCounts] = useState({
    Religious: 0,
    Psychology: 0,
    Novels: 0,
    Science: 0,
    History: 0,
    Biography: 0,
    Business: 0
  });

  const categories = [
    // ✅ FIXED: Universal prayer hands - represents all faiths
    { name: 'Religious', icon: '🙏', color: '#9b59b6', books: bookCounts.Religious },
    { name: 'Psychology', icon: '🧠', color: '#16a085', books: bookCounts.Psychology },
    { name: 'Novels', icon: '📖', color: '#27ae60', books: bookCounts.Novels },
    { name: 'Science', icon: '🔬', color: '#e74c3c', books: bookCounts.Science },
    { name: 'History', icon: '🕰️', color: '#f39c12', books: bookCounts.History },
    { name: 'Biography', icon: '👤', color: '#5b5fd8', books: bookCounts.Biography },
    { name: 'Business', icon: '💼', color: '#3498db', books: bookCounts.Business },
  ];

  useEffect(() => {
    fetchBookCounts();
  }, []);

  const fetchBookCounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      
      if (data.success) {
        const counts = {};
        
        // Count books in each category
        data.data.forEach(book => {
          const category = book.category || 'Novels'; // Default to Novels if no category
          counts[category] = (counts[category] || 0) + 1;
        });
        
        setBookCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleCategoryClick = (categoryName) => {
    // Navigate to books page with category filter
    navigate(`/books?category=${categoryName}`);
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1>📚 Browse by Category</h1>
        <p>Explore books organized by topics</p>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search categories..." 
          className="category-search"
        />
      </div>

      <div className="categories-grid">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="category-card"
            onClick={() => handleCategoryClick(category.name)}
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="category-icon" 
              style={{ backgroundColor: category.color }}
            >
              <span>{category.icon}</span>
            </div>
            <h3>{category.name}</h3>
            <p className="book-count">
              <span style={{ color: category.color }}>●</span> {category.books} books
            </p>
          </div>
        ))}
      </div>

      <button 
        className="add-category-btn"
        onClick={() => navigate('/upload')}
      >
        <span>+</span> Add New Book
      </button>
    </div>
  );
};

export default Categories;