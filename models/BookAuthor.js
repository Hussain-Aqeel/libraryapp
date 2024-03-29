const mongoose = require('mongoose');

const BookAuthorSchema = new mongoose.Schema({
  Author_ID: {
    type: String,
    required: true
  },
  ISBN_Code: {
    type: String,
    required: true
  }
});

const BookAuthor = mongoose.model('bookauthors', BookAuthorSchema);

module.exports = BookAuthor;