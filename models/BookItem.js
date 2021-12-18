const mongoose = require('mongoose');

const BookItemSchema = new mongoose.Schema({
  ISBN_Code: {
    type: String,
    required: true
  },
  Bar_Code: {
    type: String,
    required: true
  },
  Book_Copy_No: {
    type: Number,
    required: true
  },
  Status: {
    type: String,
    required: true
  },
  Shelf_ID: {
    type: Number,
    required: true
  }
});

const BookItem = mongoose.model('bookitems', BookItemSchema);

module.exports = BookItem;