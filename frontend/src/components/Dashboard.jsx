import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    categories: 0,
    recentUploads: 0,
    totalPages: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      
      if (data.success) {
        const books = data.books || [];
        
        // Calculate statistics
        const categories = [...new Set(books.map(book => book.category).filter(Boolean))];
        const totalPages = books.reduce((sum, book) => sum + (parseInt(book.pages) || 0), 0);
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentUploads = books.filter(book => new Date(book.uploadedAt) > oneWeekAgo).length;
        
        setStats({
          totalBooks: books.length,
          categories: categories.length,
          recentUploads: recentUploads,
          totalPages: totalPages
        });
        
        // Get 3 most recent books
        const recent = books
          .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
          .slice(0, 3);
        setRecentBooks(recent);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: '📤',
      title: 'Upload Book',
      description: 'Add a new book to your library',
      link: '/add-book',
      color: '#667eea'
    },
    {
      icon: '📚',
      title: 'Browse Books',
      description: 'View all books in your collection',
      link: '/books',
      color: '#764ba2'
    },
    {
      icon: '🏷️',
      title: 'Categories',
      description: 'Organize your books by category',
      link: '/categories',
      color: '#f093fb'
    },
    {
      icon: '⚙️',
      title: 'Settings',
      description: 'Configure your library preferences',
      link: '/settings',
      color: '#4facfe'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-dashboard">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h1>📚 Welcome to VIKLIB </h1> <br/> <h4> Your Digital Library</h4>
          <p>Manage and explore your book collection with ease</p>
        </div>
        <div className="welcome-time">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-1">
          <div className="stat-icon">📚</div>
          <div className="stat-details">
            <h3>{stats.totalBooks}</h3>
            <p>Total Books</p>
          </div>
          <div className="stat-trend">↗️ Growing</div>
        </div>

        <div className="stat-card stat-card-2">
          <div className="stat-icon">🏷️</div>
          <div className="stat-details">
            <h3>{stats.categories}</h3>
            <p>Categories</p>
          </div>
          <div className="stat-trend">📊 Organized</div>
        </div>

        <div className="stat-card stat-card-3">
          <div className="stat-icon">⭐</div>
          <div className="stat-details">
            <h3>{stats.recentUploads}</h3>
            <p>This Week</p>
          </div>
          <div className="stat-trend">🔥 Active</div>
        </div>

        <div className="stat-card stat-card-4">
          <div className="stat-icon">📄</div>
          <div className="stat-details">
            <h3>{stats.totalPages.toLocaleString()}</h3>
            <p>Total Pages</p>
          </div>
          <div className="stat-trend">📖 Reading</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>⚡ Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <Link 
              key={index} 
              to={action.link} 
              className="quick-action-card"
              style={{ '--card-color': action.color }}
            >
              <div className="action-icon">{action.icon}</div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
              <div className="action-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Books */}
      <div className="recent-books-section">
        <div className="section-header">
          <h2>📖 Recently Added Books</h2>
          <Link to="/books" className="view-all-link">
            View All →
          </Link>
        </div>

        {recentBooks.length === 0 ? (
          <div className="no-recent-books">
            <div className="empty-icon">📚</div>
            <h3>No Books Yet</h3>
            <p>Start building your library by uploading your first book!</p>
            <Link to="/add-book" className="upload-first-book-btn">
              ➕ Upload Your First Book
            </Link>
          </div>
        ) : (
          <div className="recent-books-grid">
            {recentBooks.map((book, index) => (
              <div key={index} className="recent-book-card">
                <div className="book-cover-mini">
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
                  <div 
                    className="book-cover-placeholder-mini" 
                    style={{ display: book.coverFilename ? 'none' : 'flex' }}
                  >
                    📚
                  </div>
                </div>
                <div className="book-info-mini">
                  <h4>{book.title}</h4>
                  <p className="book-author-mini">✍️ {book.author}</p>
                  <div className="book-meta-mini">
                    {book.category && (
                      <span className="category-badge">{book.category}</span>
                    )}
                    {book.publishedYear && (
                      <span className="year-badge">{book.publishedYear}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Feed */}
      <div className="activity-feed-section">
        <h2>📊 Library Statistics</h2>
        <div className="activity-grid">
          <div className="activity-item">
            <div className="activity-icon">📚</div>
            <div className="activity-content">
              <h4>Total Collection</h4>
              <p>{stats.totalBooks} books across {stats.categories} categories</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📈</div>
            <div className="activity-content">
              <h4>Recent Activity</h4>
              <p>{stats.recentUploads} books added in the last 7 days</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📖</div>
            <div className="activity-content">
              <h4>Reading Progress</h4>
              <p>{stats.totalPages.toLocaleString()} pages available to read</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;