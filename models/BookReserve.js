const mongoose = require('mongoose');

const BookReserveSchema = new mongoose.Schema({
  Borrower_ID: {
    type: String,
    required: true
  },
  Reserve_Date: {
    type: Date,
    default: Date.now
  },
  ISBN_Code: {
    type: String,
    required: true
  },
  Status: {
    type: String,
    required: true
  }
});

const BookReserve = mongoose.model('bookReserve', BookReserveSchema);

module.exports = BookReserve;