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
    required: false
  },
  Status: {
    type: String,
    required: false
  }
});

const BookReserve = mongoose.model('bookreserves', BookReserveSchema);

module.exports = BookReserve;