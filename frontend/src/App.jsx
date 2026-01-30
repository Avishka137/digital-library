import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AddBook from './components/AddBook';
import Books from './components/Books';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import Settings from './components/Settings';
import './App.css';

// Placeholder pages
const BorrowedBooks = () => (
  <div className="page-content">
    <h1>📖 Borrowed Books</h1>
    <p>View borrowed books here.</p>
  </div>
);

const Users = () => (
  <div className="page-content">
    <h1>👥 Users</h1>
    <p>Manage library users here.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/books" element={<Books />} />
              <Route path="/add-book" element={<AddBook />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/borrowed" element={<BorrowedBooks />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;