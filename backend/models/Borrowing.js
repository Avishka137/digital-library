const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrow_date: {
    type: Date,
    default: Date.now
  },
  due_date: Date,
  return_date: Date,
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Borrowing', borrowingSchema);