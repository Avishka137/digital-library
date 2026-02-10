// src/utils/auth.js
// Utility functions for authentication and authorization

import { jwtDecode } from 'jwt-decode';

// Get current user from token
export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if user is admin
export const isAdmin = () => {
  try {
    const user = getCurrentUser();
    return user && user.role === 'admin';
  } catch (error) {
    return false;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const decoded = jwtDecode(token);
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// Get user role
export const getUserRole = () => {
  try {
    const user = getCurrentUser();
    return user?.role || 'guest';
  } catch (error) {
    return 'guest';
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};