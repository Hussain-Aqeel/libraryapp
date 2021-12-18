const mongoose = require('mongoose');

const BookLoanSchema = new mongoose.Schema({
  Borrower_ID: {
    type: String,
    required: true
  },
  Bar_Code: {
    type: String,
    required: true
  },
  Borrowed_From: {
    type: Date,
    default: Date.now
  },
  Borrowed_To: {
    type: Date,
    required: true
  },
  Actual_Return: {
    type: Date,
    required: true
  },
  Issued_By: {
    type: String,
    required: true
  }
});

const BookLoan = mongoose.model('bookloans', BookLoanSchema);

module.exports = BookLoan;