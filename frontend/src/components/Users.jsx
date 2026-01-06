import React, { useState } from 'react';
import { Users as UsersIcon, Plus, Edit2, Trash2, Search, X, Mail, Phone, MapPin, Shield, User } from 'lucide-react';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john.doe@example.com', 
      phone: '+1 234 567 8900',
      role: 'Admin',
      location: 'New York, USA',
      avatar: 'JD',
      color: 'blue',
      borrowedBooks: 5
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane.smith@example.com', 
      phone: '+1 234 567 8901',
      role: 'Librarian',
      location: 'Los Angeles, USA',
      avatar: 'JS',
      color: 'purple',
      borrowedBooks: 3
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike.j@example.com', 
      phone: '+1 234 567 8902',
      role: 'Member',
      location: 'Chicago, USA',
      avatar: 'MJ',
      color: 'green',
      borrowedBooks: 8
    },
    { 
      id: 4, 
      name: 'Sarah Williams', 
      email: 'sarah.w@example.com', 
      phone: '+1 234 567 8903',
      role: 'Member',
      location: 'Houston, USA',
      avatar: 'SW',
      color: 'pink',
      borrowedBooks: 2
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    role: 'Member',
    location: '',
    avatar: '',
    color: 'blue'
  });

  const roleOptions = ['Admin', 'Librarian', 'Member', 'Guest'];
  
  const colorOptions = [
    { name: 'Blue', value: 'blue' },
    { name: 'Purple', value: 'purple' },
    { name: 'Green', value: 'green' },
    { name: 'Red', value: 'red' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Indigo', value: 'indigo' },
    { name: 'Pink', value: 'pink' },
    { name: 'Teal', value: 'teal' }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateAvatar = (name) => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleAddUser = () => {
    if (newUser.name.trim() && newUser.email.trim()) {
      const avatar = newUser.avatar || generateAvatar(newUser.name);
      const newUserData = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        ...newUser,
        avatar,
        borrowedBooks: 0
      };
      setUsers([...users, newUserData]);
      resetForm();
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ 
      name: user.name, 
      email: user.email, 
      phone: user.phone,
      role: user.role,
      location: user.location,
      avatar: user.avatar,
      color: user.color
    });
    setIsAddModalOpen(true);
  };

  const handleUpdateUser = () => {
    if (editingUser && newUser.name.trim() && newUser.email.trim()) {
      const avatar = newUser.avatar || generateAvatar(newUser.name);
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...user, ...newUser, avatar }
          : user
      ));
      resetForm();
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const resetForm = () => {
    setIsAddModalOpen(false);
    setEditingUser(null);
    setNewUser({ 
      name: '', 
      email: '', 
      phone: '',
      role: 'Member',
      location: '',
      avatar: '',
      color: 'blue'
    });
  };

  return (
    <div className="users-page">
      <div className="users-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-icon">
              <UsersIcon className="icon" />
            </div>
            <div className="header-text">
              <h1 className="gradient-text">Users</h1>
              <p className="subtitle">Manage library users and permissions</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon color-blue">
              <UsersIcon className="icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Users</p>
              <h3 className="stat-value">{users.length}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon color-purple">
              <Shield className="icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Admins</p>
              <h3 className="stat-value">{users.filter(u => u.role === 'Admin').length}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon color-green">
              <User className="icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Members</p>
              <h3 className="stat-value">{users.filter(u => u.role === 'Member').length}</h3>
            </div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="controls-section">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              setNewUser({ 
                name: '', 
                email: '', 
                phone: '',
                role: 'Member',
                location: '',
                avatar: '',
                color: 'blue'
              });
              setIsAddModalOpen(true);
            }}
            className="add-user-btn"
          >
            <Plus className="btn-icon" />
            Add User
          </button>
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="users-grid">
            {filteredUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="card-header">
                  <div className={`user-avatar color-${user.color}`}>
                    <span className="avatar-text">{user.avatar}</span>
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="edit-btn"
                      title="Edit user"
                    >
                      <Edit2 className="action-icon" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="delete-btn"
                      title="Delete user"
                    >
                      <Trash2 className="action-icon" />
                    </button>
                  </div>
                </div>
                
                <div className="user-info">
                  <h3 className="user-name">{user.name}</h3>
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </div>

                <div className="user-details">
                  <div className="detail-row">
                    <Mail className="detail-icon" />
                    <span className="detail-text">{user.email}</span>
                  </div>
                  <div className="detail-row">
                    <Phone className="detail-icon" />
                    <span className="detail-text">{user.phone}</span>
                  </div>
                  <div className="detail-row">
                    <MapPin className="detail-icon" />
                    <span className="detail-text">{user.location}</span>
                  </div>
                </div>

                <div className="user-footer">
                  <p className="borrowed-count">
                    {user.borrowedBooks} {user.borrowedBooks === 1 ? 'book' : 'books'} borrowed
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <UsersIcon className="icon" />
            </div>
            <h3 className="empty-title">No users found</h3>
            <p className="empty-text">Try adjusting your search or create a new user</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isAddModalOpen && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h2>
                <button onClick={resetForm} className="close-btn">
                  <X className="close-icon" />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="John Doe"
                      className="form-input"
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="john@example.com"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      placeholder="+1 234 567 8900"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      value={newUser.location}
                      onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                      placeholder="New York, USA"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <div className="role-grid">
                    {roleOptions.map((role) => (
                      <button
                        key={role}
                        onClick={() => setNewUser({ ...newUser, role })}
                        className={`role-selector ${newUser.role === role ? 'selected' : ''}`}
                      >
                        <Shield className="role-icon" />
                        <span>{role}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Avatar Color</label>
                  <div className="color-grid">
                    {colorOptions.map((colorObj) => (
                      <button
                        key={colorObj.value}
                        onClick={() => setNewUser({ ...newUser, color: colorObj.value })}
                        className={`color-option color-${colorObj.value} ${
                          newUser.color === colorObj.value ? 'selected' : ''
                        }`}
                        title={colorObj.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
                <button
                  onClick={editingUser ? handleUpdateUser : handleAddUser}
                  disabled={!newUser.name.trim() || !newUser.email.trim()}
                  className="submit-btn"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;