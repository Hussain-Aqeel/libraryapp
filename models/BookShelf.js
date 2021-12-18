const mongoose = require('mongoose');

const BookShelfSchema = new mongoose.Schema({
  Shelf_ID: {
    type: Number,
    required: true
  },
  Shelf_No: {
    type: String,
    required: true
  },
  Floor_No: {
    type: Number,
    required: true
  }
});

const BookShelf = mongoose.model('bookshelfs', BookShelfSchema);

module.exports = BookShelf;