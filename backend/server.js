const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploaded PDFs and covers
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const bookRoutes = require('./routes/bookRoutes');
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
      books: '/api/books'
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('════════════════════════════════════════');
  console.log('✅ Server running successfully!');
  console.log('════════════════════════════════════════');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📚 Books API: http://localhost:${PORT}/api/books`);
  console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
  console.log('════════════════════════════════════════');
  console.log('');
});