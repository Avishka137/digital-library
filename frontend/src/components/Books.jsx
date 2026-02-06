import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import './Books.css';

const Books = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Religious', 'Psychology', 'Novels', 'Science', 'History', 'Biography', 'Business'];

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    // Check if category filter is in URL
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    filterBooks();
  }, [books, selectedCategory, searchQuery]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      
      if (data.success) {
        console.log('Books loaded:', data.data); // Debug log
        setBooks(data.data);
        setFilteredBooks(data.data);
      } else {
        console.error('Failed to fetch books:', data.message);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to load books. Make sure backend is running on port 5000!');
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Update URL
    if (category === 'All') {
      navigate('/books');
    } else {
      navigate(`/books?category=${category}`);
    }
  };

  const handleBookDelete = (bookId) => {
    // Remove book from state immediately
    setBooks(books.filter(book => book._id !== bookId));
  };

  const handleRefresh = () => {
    fetchBooks();
  };

  if (loading) {
    return (
      <div className="books-container">
        <div className="loading-container">
          <div className="spinner">⏳</div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="books-container">
      <div className="books-header">
        <h1>📚 All Books</h1>
        {selectedCategory !== 'All' && (
          <p className="category-badge">
            Showing: <strong>{selectedCategory}</strong> ({filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'})
          </p>
        )}
      </div>

      <div className="books-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filter">
          {categories.map(category => {
            const count = category === 'All' 
              ? books.length 
              : books.filter(b => b.category === category).length;
            
            return (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
                <span className="count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="no-books">
          <div className="empty-icon">📭</div>
          <h2>No Books Found</h2>
          <p>
            {searchQuery 
              ? `No books match "${searchQuery}"`
              : selectedCategory !== 'All'
              ? `No books in ${selectedCategory} category`
              : 'Your library is empty'
            }
          </p>
          <button onClick={() => navigate('/upload')} className="upload-btn">
            + Upload New Book
          </button>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map(book => (
            <BookCard 
              key={book._id} 
              book={book}
              onDelete={handleBookDelete}
              onRefresh={handleRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;