const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');
const { ensureAuthenticated } = require('../config/auth');
const ObjectID = require('mongodb').ObjectID;

// Models
const User = require('../models/User');
const Book = require('../models/Book');
const BookAuthor = require('../models/BookAuthor')
const BookItem = require('../models/BookItem')
const BookLoan = require('../models/BookLoan')
const BookReserve = require('../models/BookReserve')
const BookShelf = require('../models/BookShelf')
const LibraryActor = require('../models/LibraryActor')
const LibraryMember = require('../models/LibraryMember')
const Librarian = require('../models/Librarian')
const System = require('../models/System')
const Subject = require('../models/Subject')
const Authors = require('../models/Authors')



// Login Page
router.get('/login', (req, res) => res.render('login'));

// account info page
router.get('/account-info', (req, res) => { 
  res.locals.name = req.user.name;
  res.locals.email = req.user.email;
  res.render('account-info', { 
    name: res.locals.name,
    email: res.locals.email 
  })
});

// manager dashboard
router.get('/manager-dashboard', (req, res) => { 
  res.locals.name = req.user.name;
  res.locals.email = req.user.email;
  res.render('manager-dashboard', {
     name: res.locals.name,
    email: res.locals.email 
  })
});

// dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) => 
{
  if(req.user) {
    res.locals.name = req.user.name;
    res.render('dashboard', { 
      name: res.locals.name,
      login: res.locals.login 
    })
  } else {
    res.render('dashboard');
  }
});

// Member Login handle
router.post('/login-member', (req, res, next) => {
  passport.authenticate('member-local', {
    successRedirect: '/users/member-dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

// Librarian Login handle
router.post('/login-librarian', (req, res, next) => {
  passport.authenticate('librarian-local', {
    successRedirect: '/users/librarian-dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

// System Login handle
router.post('/login-system', (req, res, next) => {
  passport.authenticate('system-local', {
    successRedirect: '/users/system-dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;