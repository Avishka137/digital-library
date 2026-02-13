const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  isbn: {
    type: String,
    trim: true,
    sparse: true // Allow multiple nulls but unique non-null values
  },
  publisher: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    min: [1000, 'Year must be after 1000'],
    max: [2100, 'Year must be before 2100']
  },
  category: {
    type: String,
    trim: true
  },
  copies_total: {
    type: Number,
    default: 1,
    min: [1, 'Must have at least 1 copy']
  },
  copies_available: {
    type: Number,
    default: 1,
    min: [0, 'Available copies cannot be negative']
  },
  description: {
    type: String,
    trim: true
  },
  // NEW: Filename for PDF (stored in /uploads/books/)
  pdfFilename: {
    type: String,
    trim: true
  },
  // NEW: Filename for cover image (stored in /uploads/covers/)
  coverFilename: {
    type: String,
    trim: true
  },
  // LEGACY: Keep these for backward compatibility
  cover_url: {
    type: String,
    trim: true
  },
  pdf_url: {
    type: String,
    trim: true
  },
  // NEW: Fields from your upload form
  publishedYear: {
    type: Number,
    min: [1000, 'Year must be after 1000'],
    max: [2100, 'Year must be before 2100']
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  language: {
    type: String,
    default: 'English'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ category: 1 });
bookSchema.index({ isbn: 1 });

// Virtual for borrowed copies
bookSchema.virtual('copies_borrowed').get(function() {
  return this.copies_total - this.copies_available;
});

// Ensure virtuals are included in JSON
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);