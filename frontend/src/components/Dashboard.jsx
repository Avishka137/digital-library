import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Upload, Tag, TrendingUp, Users, BookOpen, ArrowRight, Sparkles, Library } from 'lucide-react';
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
      color: '#6366f1',
      bgColor: '#e0e7ff',
      link: '/books'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: Tag,
      color: '#ec4899',
      bgColor: '#fce7f3',
      link: '/categories'
    },
    {
      title: 'Recently Added',
      value: stats.recentlyAdded,
      icon: TrendingUp,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      link: '/books'
    },
    {
      title: 'Borrowed Books',
      value: stats.borrowedBooks,
      icon: BookOpen,
      color: '#10b981',
      bgColor: '#d1fae5',
      link: '/borrowed'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-dashboard">
          <div className="loader">
            <div className="loader-circle"></div>
          </div>
          <p>Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Hero Section with Book Library Theme */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
          <svg className="hero-books" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="80" width="35" height="120" fill="rgba(255,255,255,0.1)" rx="4"/>
            <rect x="95" y="70" width="35" height="130" fill="rgba(255,255,255,0.15)" rx="4"/>
            <rect x="140" y="90" width="35" height="110" fill="rgba(255,255,255,0.1)" rx="4"/>
            <rect x="185" y="60" width="35" height="140" fill="rgba(255,255,255,0.12)" rx="4"/>
            <rect x="230" y="85" width="35" height="115" fill="rgba(255,255,255,0.1)" rx="4"/>
            <rect x="275" y="75" width="35" height="125" fill="rgba(255,255,255,0.14)" rx="4"/>
          </svg>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <Library size={16} />
              <span>Welcome Back</span>
            </div>
            <h1 className="hero-title">
              Your Digital <span className="gradient-text">Library</span>
            </h1>
            <p className="hero-subtitle">
              Discover, manage, and organize your book collection with ease
            </p>
          </div>
          
          <div className="hero-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/add-book')}
            >
              <Upload size={20} />
              Add New Book
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/books')}
            >
              Browse Collection
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-section">
        <h2 className="section-subtitle">Your Library At A Glance</h2>
        <div className="stats-grid">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="stat-card"
                onClick={() => navigate(stat.link)}
                style={{ 
                  '--stat-color': stat.color,
                  '--stat-bg': stat.bgColor
                }}
              >
                <div className="stat-header">
                  <div className="stat-icon">
                    <Icon size={28} />
                  </div>
                  <span className="stat-label">{stat.title}</span>
                </div>
                <div className="stat-value">{stat.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="actions-section">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
          <p className="section-description">Get started with these common tasks</p>
        </div>
        
        <div className="actions-grid">
          <button 
            className="action-card"
            onClick={() => navigate('/add-book')}
          >
            <div className="action-icon" style={{ '--icon-bg': '#6366f1' }}>
              <Upload size={32} />
            </div>
            <div className="action-text">
              <h3>Upload Book</h3>
              <p>Add a new title to your collection</p>
            </div>
            <ArrowRight size={20} className="action-arrow" />
          </button>

          <button 
            className="action-card"
            onClick={() => navigate('/books')}
          >
            <div className="action-icon" style={{ '--icon-bg': '#ec4899' }}>
              <Book size={32} />
            </div>
            <div className="action-text">
              <h3>View All Books</h3>
              <p>Browse your entire collection</p>
            </div>
            <ArrowRight size={20} className="action-arrow" />
          </button>

          <button 
            className="action-card"
            onClick={() => navigate('/categories')}
          >
            <div className="action-icon" style={{ '--icon-bg': '#f59e0b' }}>
              <Tag size={32} />
            </div>
            <div className="action-text">
              <h3>Manage Categories</h3>
              <p>Organize your library by genre</p>
            </div>
            <ArrowRight size={20} className="action-arrow" />
          </button>

          <button 
            className="action-card"
            onClick={() => navigate('/users')}
          >
            <div className="action-icon" style={{ '--icon-bg': '#10b981' }}>
              <Users size={32} />
            </div>
            <div className="action-text">
              <h3>Manage Users</h3>
              <p>View and manage library members</p>
            </div>
            <ArrowRight size={20} className="action-arrow" />
          </button>
        </div>
      </div>

      {/* Recently Added Books */}
      <div className="books-section">
        <div className="section-header">
          <h2 className="section-title">Recently Added</h2>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/books')}
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        {recentBooks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Book size={56} />
            </div>
            <h3>No Books Yet</h3>
            <p>Start building your library by uploading your first book</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/add-book')}
            >
              <Upload size={18} />
              Upload First Book
            </button>
          </div>
        ) : (
          <div className="books-grid">
            {recentBooks.map((book, index) => (
              <div 
                key={book._id} 
                className="book-card"
                onClick={() => navigate('/books')}
                style={{ '--card-delay': `${index * 0.1}s` }}
              >
                <div className="book-cover">
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
                  <div className="book-placeholder" style={{ display: book.coverFilename ? 'none' : 'flex' }}>
                    <BookOpen size={48} />
                  </div>
                </div>
                <div className="book-info">
                  <h4 className="book-title">{book.title}</h4>
                  <p className="book-author">{book.author}</p>
                  {book.category && (
                    <span className="book-category">{book.category}</span>
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