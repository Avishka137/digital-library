const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    isbn: {
      type: String,
      trim: true,
      sparse: true
    },
    category: {
      type: String,
      required: true,  // Made required so every book has a category
      trim: true,
      enum: ['Religious', 'Psychology', 'Novels', 'Science', 'History', 'Biography', 'Business'],  // Match your categories page
      default: 'Novels'
    },
    description: {
      type: String,
      trim: true
    },
    publishedYear: {
      type: Number
    },
    pages: {
      type: Number
    },
    coverFilename: {
      type: String
    },
    pdfFilename: {
      type: String
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

// Index for faster category queries
bookSchema.index({ category: 1 });

module.exports = mongoose.model('Book', bookSchema);