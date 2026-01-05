import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Book, Plus, Tag, BookOpen, Users, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/books', icon: Book, label: 'All Books' },
    { path: '/add-book', icon: Plus, label: 'Upload Book' },
    { path: '/categories', icon: Tag, label: 'Categories' },
    { path: '/borrowed', icon: BookOpen, label: 'Borrowed Books' },
    { path: '/users', icon: Users, label: 'Users', adminOnly: true },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">📚</span>
          <h2>VIKLIB</h2>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <IconComponent className="menu-icon" size={20} />
              <span className="menu-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <h4>Admin</h4>
            <p>Administrator</p>
          </div>
        </div>
        <button className="logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;