// Example: How to protect Upload Book page/button

// In your Sidebar.jsx or wherever you have the Upload Book link:

import { isAdmin } from '../utils/auth';

const Sidebar = () => {
  const userIsAdmin = isAdmin();

  return (
    <div className="sidebar">
      {/* All Books - Everyone can see */}
      <Link to="/books" className="sidebar-item">
        📚 All Books
      </Link>

      {/* Upload Book - ADMIN ONLY */}
      {userIsAdmin && (
        <Link to="/upload" className="sidebar-item">
          ➕ Upload Book
        </Link>
      )}

      {/* Categories - Everyone can see */}
      <Link to="/categories" className="sidebar-item">
        🏷️ Categories
      </Link>

      {/* Borrowed Books - Everyone can see */}
      <Link to="/borrowed" className="sidebar-item">
        📖 Borrowed Books
      </Link>

      {/* Users - ADMIN ONLY */}
      {userIsAdmin && (
        <Link to="/users" className="sidebar-item">
          👥 Users
        </Link>
      )}

      {/* Settings - ADMIN ONLY */}
      {userIsAdmin && (
        <Link to="/settings" className="sidebar-item">
          ⚙️ Settings
        </Link>
      )}
    </div>
  );
};

export default Sidebar;