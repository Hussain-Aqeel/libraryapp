const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Book = require('../models/Book');


// GET member dashboard
router.get('/member-dashboard', ensureAuthenticated, (req, res) => 
{
    res.locals.First_Name = req.user.First_Name;
    res.locals.login = req.user.login;
    res.locals.People_ID = req.user.People_ID;
    res.locals.People_Type = req.user.People_Type;

    res.render('member-dashboard', { 
      name: res.locals.First_Name,
      login: res.locals.login,
      type: res.locals.People_Type
    })
});


// GET librarian dashboard
router.get('/librarian-dashboard', ensureAuthenticated, (req, res) => 
{
  if(req.user) {
    res.locals.First_Name = req.user.First_Name;
    res.locals.login = req.user.login;
    res.locals.People_ID = req.user.People_ID;
    res.locals.People_Type = req.user.People_Type;

    res.render('librarian-dashboard', { 
      name: res.locals.First_Name,
      login: res.locals.login,
      type: res.locals.People_Type
    })
  } else {
    res.render('librarian-dashboard');
  }
});

// GET system dashboard
router.get('/system-dashboard', ensureAuthenticated, (req, res) => 
{
  if(req.user) {
    res.locals.First_Name = req.user.First_Name;
    res.locals.login = req.user.login;
    res.locals.People_ID = req.user.People_ID;
    res.locals.People_Type = req.user.People_Type;

    res.render('system-dashboard', { 
      name: res.locals.First_Name,
      login: res.locals.login,
      type: res.locals.People_Type
    })
  } else {
    res.render('system-dashboard');
  }
});

// GET available books 
router.get("/available-books", ensureAuthenticated, function (req, res) {   
  Book.find({}, function (err, allDetails) {
      if (err) {
          console.log(err);
      } else {
        res.locals.First_Name = req.user.First_Name;
        res.locals.login = req.user.login;
        res.locals.People_ID = req.user.People_ID;
        res.locals.People_Type = req.user.People_Type;
        res.render('available-books', { 
          name: res.locals.First_Name,
          login: res.locals.login,
          type: res.locals.People_Type,
          details: allDetails 
        })
      }
  })
});


// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});


module.exports = router;