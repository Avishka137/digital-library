// frontend/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    booksBorrowed: 0,
    availableBooks: 0
  });

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Replace with your actual API endpoints
      const [booksRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/books', { headers }),
        fetch('http://localhost:5000/api/users', { headers })
      ]);

      if (booksRes.ok && usersRes.ok) {
        const booksData = await booksRes.json();
        const usersData = await usersRes.json();

        setStats({
          totalBooks: booksData.length || 0,
          totalUsers: usersData.length || 0,
          booksBorrowed: 0,
          availableBooks: booksData.filter(b => b.available).length || 0
        });

        setBooks(booksData.slice(0, 6));
      } else {
        // Use mock data if API fails
        setStats({
          totalBooks: 1,
          totalUsers: 1,
          booksBorrowed: 0,
          availableBooks: 1
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Use mock data for development
      setStats({
        totalBooks: 1,
        totalUsers: 1,
        booksBorrowed: 0,
        availableBooks: 1
      });
      setBooks([]);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const handleViewPDF = (book) => {
    if (book.pdfUrl) {
      window.open(book.pdfUrl, '_blank');
    } else {
      alert('PDF not available');
    }
  };

  const handleEditBook = (bookId) => {
    window.location.href = `/books/edit/${bookId}`;
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          alert('Book deleted successfully!');
          fetchDashboardData();
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book');
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <i className="fas fa-book-reader"></i>
          <h2>Digital Library</h2>
        </div>
        
        <nav className="nav-menu">
          <a href="/dashboard" className="nav-item active">
            <i className="fas fa-chart-line"></i>
            <span>Dashboard</span>
          </a>
          <a href="/books" className="nav-item">
            <i className="fas fa-book"></i>
            <span>All Books</span>
          </a>
          <a href="/categories" className="nav-item">
            <i className="fas fa-th-large"></i>
            <span>Categories</span>
          </a>
          <a href="/users" className="nav-item">
            <i className="fas fa-users"></i>
            <span>Users</span>
          </a>
          <a href="/borrowings" className="nav-item">
            <i className="fas fa-clock"></i>
            <span>Borrowed Books</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-details">
              <p className="user-name">Admin</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="search-container">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search books, authors, or categories..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="top-actions">
            <button className="icon-btn">
              <i className="fas fa-bell"></i>
              <span className="badge">3</span>
            </button>
            <button className="icon-btn">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="page-header">
            <h1>Dashboard Overview</h1>
            <p>Welcome back, Admin! Here's what's happening with your library today.</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon books">
                <i className="fas fa-book"></i>
              </div>
              <div className="stat-details">
                <h3>Total Books</h3>
                <p className="stat-number">{stats.totalBooks}</p>
                <span className="stat-change positive">
                  <i className="fas fa-arrow-up"></i> 0% from last month
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon users">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-details">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.totalUsers}</p>
                <span className="stat-change positive">
                  <i className="fas fa-arrow-up"></i> 0% from last month
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon borrowed">
                <i className="fas fa-book-open"></i>
              </div>
              <div className="stat-details">
                <h3>Books Borrowed</h3>
                <p className="stat-number">{stats.booksBorrowed}</p>
                <span className="stat-change neutral">
                  <i className="fas fa-minus"></i> 0% from last month
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon available">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-details">
                <h3>Available Books</h3>
                <p className="stat-number">{stats.availableBooks}</p>
                <span className="stat-change positive">
                  <i className="fas fa-arrow-up"></i> 100% available
                </span>
              </div>
            </div>
          </div>

          {/* Recent Books Section */}
          <div className="section">
            <div className="section-header">
              <h2>Recent Books</h2>
              <button className="btn-primary" onClick={() => window.location.href = '/books/add'}>
                <i className="fas fa-plus"></i> Add New Book
              </button>
            </div>

            {loading ? (
              <div className="loading">
                <i className="fas fa-spinner fa-spin"></i> Loading...
              </div>
            ) : (
              <div className="books-grid">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <div key={book._id} className="book-card">
                      <div className="book-cover">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} />
                        ) : (
                          <i className="fas fa-book"></i>
                        )}
                      </div>
                      <div className="book-info">
                        <h3>{book.title}</h3>
                        <p className="book-author">by {book.author}</p>
                        <span className="book-category">{book.category}</span>
                        <div className="book-actions">
                          <button className="btn-view" onClick={() => handleViewPDF(book)}>
                            <i className="fas fa-eye"></i> View PDF
                          </button>
                          <button className="btn-edit" onClick={() => handleEditBook(book._id)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteBook(book._id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-books">
                    <i className="fas fa-book-open"></i>
                    <p>No books found. Add your first book to get started!</p>
                  </div>
                )}

                {/* Add Book Placeholder */}
                <div className="book-card add-card" onClick={() => window.location.href = '/books/add'}>
                  <div className="add-content">
                    <i className="fas fa-plus-circle"></i>
                    <p>Add New Book</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <button className="action-card" onClick={() => window.location.href = '/books/add'}>
                <i className="fas fa-upload"></i>
                <span>Upload Book</span>
              </button>
              <button className="action-card" onClick={() => window.location.href = '/users/add'}>
                <i className="fas fa-user-plus"></i>
                <span>Add User</span>
              </button>
              <button className="action-card" onClick={() => window.location.href = '/categories'}>
                <i className="fas fa-tags"></i>
                <span>Manage Categories</span>
              </button>
              <button className="action-card" onClick={() => window.location.href = '/reports'}>
                <i className="fas fa-chart-bar"></i>
                <span>View Reports</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;