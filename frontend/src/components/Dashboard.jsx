import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Upload, Tag, TrendingUp, Users, BookOpen } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    categories: 6,
    recentlyAdded: 0,
    borrowedBooks: 0
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
        const books = data.data || [];
        setStats({
          totalBooks: books.length,
          categories: 6,
          recentlyAdded: books.slice(0, 5).length,
          borrowedBooks: 0
        });
        setRecentBooks(books.slice(0, 6));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: Book,
      color: '#2ecc71',
      bgColor: '#d5f4e6',
      link: '/books'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: Tag,
      color: '#3498db',
      bgColor: '#d6eaf8',
      link: '/categories'
    },
    {
      title: 'Recently Added',
      value: stats.recentlyAdded,
      icon: TrendingUp,
      color: '#f39c12',
      bgColor: '#fdebd0',
      link: '/books'
    },
    {
      title: 'Borrowed Books',
      value: stats.borrowedBooks,
      icon: BookOpen,
      color: '#9b59b6',
      bgColor: '#ebdef0',
      link: '/borrowed'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-dashboard">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-icon">
            <Book size={48} />
          </div>
          <div className="welcome-text">
            <h1>Welcome to VIKLIB</h1>
            <p>Your Digital Library Management System</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="stat-card"
              onClick={() => navigate(stat.link)}
              style={{ 
                borderLeft: `4px solid ${stat.color}`
              }}
            >
              <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
                <Icon size={32} color={stat.color} />
              </div>
              <div className="stat-info">
                <p className="stat-label">{stat.title}</p>
                <h2 className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">📋 Quick Actions</h2>
        <div className="quick-actions-grid">
          <button 
            className="action-card"
            onClick={() => navigate('/add-book')}
          >
            <div className="action-icon" style={{ background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' }}>
              <Upload size={28} />
            </div>
            <div className="action-content">
              <h3>Upload Book</h3>
              <p>Add a new book to your library</p>
            </div>
          </button>

          <button 
            className="action-card"
            onClick={() => navigate('/books')}
          >
            <div className="action-icon" style={{ background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)' }}>
              <Book size={28} />
            </div>
            <div className="action-content">
              <h3>View All Books</h3>
              <p>Browse your book collection</p>
            </div>
          </button>

          <button 
            className="action-card"
            onClick={() => navigate('/categories')}
          >
            <div className="action-icon" style={{ background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' }}>
              <Tag size={28} />
            </div>
            <div className="action-content">
              <h3>Manage Categories</h3>
              <p>Organize your library</p>
            </div>
          </button>

          <button 
            className="action-card"
            onClick={() => navigate('/users')}
          >
            <div className="action-icon" style={{ background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)' }}>
              <Users size={28} />
            </div>
            <div className="action-content">
              <h3>Manage Users</h3>
              <p>View and manage library users</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recently Added Books */}
      <div className="recent-books-section">
        <div className="section-header">
          <h2 className="section-title">📚 Recently Added Books</h2>
          <button 
            className="view-all-link"
            onClick={() => navigate('/books')}
          >
            View All →
          </button>
        </div>
        
        {recentBooks.length === 0 ? (
          <div className="empty-recent">
            <Book size={48} color="#ccc" />
            <p>No books in your library yet</p>
            <button 
              className="upload-first-btn"
              onClick={() => navigate('/add-book')}
            >
              Upload Your First Book
            </button>
          </div>
        ) : (
          <div className="recent-books-grid">
            {recentBooks.map((book) => (
              <div 
                key={book._id} 
                className="recent-book-card"
                onClick={() => navigate('/books')}
              >
                <div className="recent-book-cover">
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
                  <div className="recent-book-placeholder" style={{ display: book.coverFilename ? 'none' : 'flex' }}>
                    📚
                  </div>
                </div>
                <div className="recent-book-info">
                  <h4>{book.title}</h4>
                  <p>{book.author}</p>
                  {book.category && (
                    <span className="recent-book-category">{book.category}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;