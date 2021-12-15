const mongoose = require('mongoose');

const LibraryActorSchema = new mongoose.Schema({
  Actor_Type: {
    type: Number,
    required: true
  },
  Designation: {
    type: String,
    required: true
  }
});

const LibraryActor = mongoose.model('libraryActor', LibraryActorSchema);

module.exports = LibraryActor;