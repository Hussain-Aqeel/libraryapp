const mongoose = require('mongoose');

const SystemSchema = new mongoose.Schema({
  People_ID: {
    type: String,
    required: true
  },
  First_Name: {
    type: String,
    required: true
  },
  Last_Name: {
    type: String,
    required: true
  },
  People_Type: {
    type: Number,
    required: true
  },
  Birth_Date: {
    type: Date,
    required: false,
    default: null
  },
  Sex: {
    type: String,
    required: false,
    default: null
  },
  Department: {
    type: String,
    required: false
  },
  Contact_Number: {
    type: String,
    required: false,
    default: null
  },
  Email: {
    type: String,
    required: false,
    default: null
  },
  Password: {
    type: String,
    required: true
  } 
});

const System = mongoose.model('system', SystemSchema);

module.exports = System;