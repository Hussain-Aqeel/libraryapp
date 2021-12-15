const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  ISBN_Code: {
    type: String,
    required: true
  },
  Book_Title: {
    type: String,
    required: true
  },
  Book_Language: {
    type: String,
    required: true
  },
  No_Of_Copies: {
    type: Number,
    required: true
  },
  Subject_ID: {
    type: Number,
    required: true
  },
  Is_Available: {
    type: String,
    required: true
  },
  Publication_Year: {
    type: Number,
    required: false
  }
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;