const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  publisher: String,
  year: Number,
  category: String,
  copies_total: {
    type: Number,
    default: 1
  },
  copies_available: {
    type: Number,
    default: 1
  },
  description: String,
  cover_url: String,
  pdf_url: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);