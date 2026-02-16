import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, Edit2, Trash2, Search, X, Mail, Phone, MapPin, Shield, User } from 'lucide-react';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    role: 'Member',
    location: '',
    password: '',
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        alert('Please login to view users');
        return;
      }

      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (response.status === 403) {
        alert('Access denied. Admin privileges required.');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // ⭐ FIX: Handle different response structures
      let usersData = [];
      if (Array.isArray(data)) {
        usersData = data;
      } else if (data.users && Array.isArray(data.users)) {
        usersData = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        usersData = data.data;
      } else {
        console.error('Unexpected API response structure:', data);
        usersData = [];
      }

      console.log('Users data:', usersData); // Debug log
      
      // ⭐ FIX: Add UI properties and use _id from MongoDB
      const usersWithUI = usersData.map(user => ({
        ...user,
        id: user._id || user.id, // ⭐ Use _id from MongoDB
        avatar: user.avatar || generateAvatar(user.name),
        color: user.color || getRandomColor(),
        borrowedBooks: user.borrowedBooks || 0
      }));
      
      console.log('Processed users:', usersWithUI); // Debug log
      setUsers(usersWithUI);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRandomColor = () => {
    const colors = ['blue', 'purple', 'green', 'red', 'yellow', 'indigo', 'pink', 'teal'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateAvatar = (name) => {
    if (!name) return 'NA';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleAddUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password) {
      alert('Please fill in all required fields (Name, Email, Password)');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const userData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        phone: newUser.phone,
        role: newUser.role,
        location: newUser.location,
        color: newUser.color
      };

      console.log('Creating user:', userData); // Debug log

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      console.log('Create user response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      await fetchUsers();
      resetForm();
      alert('✅ User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('❌ ' + (error.message || 'Failed to create user. Please try again.'));
    }
  };

  const handleEditUser = (user) => {
    console.log('Editing user:', user); // Debug log
    setEditingUser(user);
    setNewUser({ 
      name: user.name, 
      email: user.email, 
      phone: user.phone || '',
      role: user.role,
      location: user.location || '',
      password: '',
      avatar: user.avatar,
      color: user.color
    });
    setIsAddModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !newUser.name.trim() || !newUser.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const userData = {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        location: newUser.location,
        color: newUser.color
      };

      if (newUser.password) {
        userData.password = newUser.password;
      }

      console.log('Updating user:', editingUser.id, userData); // Debug log

      const response = await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      console.log('Update user response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      await fetchUsers();
      resetForm();
      alert('✅ User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('❌ ' + (error.message || 'Failed to update user. Please try again.'));
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      console.log('Deleting user:', id); // Debug log

      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Delete user response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }

      await fetchUsers();
      alert('✅ User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('❌ ' + (error.message || 'Failed to delete user. Please try again.'));
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
      password: '',
      avatar: '',
      color: 'blue'
    });
  };

  if (loading) {
    return (
      <div className="users-page">
        <div className="users-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-container">
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
                password: '',
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
                    <span className="detail-text">{user.phone || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <MapPin className="detail-icon" />
                    <span className="detail-text">{user.location || 'N/A'}</span>
                  </div>
                </div>

                <div className="user-footer">
                  <p className="borrowed-count">
                    {user.borrowedBooks || 0} {user.borrowedBooks === 1 ? 'book' : 'books'} borrowed
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
            <p className="empty-text">
              {searchTerm 
                ? 'Try adjusting your search or create a new user' 
                : 'Get started by creating your first user'}
            </p>
          </div>
        )}

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
                    <label className="form-label">Password {!editingUser && '*'}</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                      className="form-input"
                    />
                  </div>

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
                  disabled={!newUser.name.trim() || !newUser.email.trim() || (!editingUser && !newUser.password)}
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