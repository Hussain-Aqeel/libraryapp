const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  Subject_ID: {
    type: Number,
    required: true
  },
  Subject_Name: {
    type: String,
    required: true
  }
});

const Subject = mongoose.model('subjects', SubjectSchema);

module.exports = Subject;