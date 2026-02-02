const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware - CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploaded PDFs and covers
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Backend is working!' 
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Digital Library API',
    endpoints: {
      test: '/api/test',
      auth: '/api/auth',
      users: '/api/users',
      books: '/api/books'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('════════════════════════════════════════');
  console.log('✅ Server running successfully!');
  console.log('════════════════════════════════════════');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`📚 Books API: http://localhost:${PORT}/api/books`);
  console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
  console.log('════════════════════════════════════════');
  console.log('');
});