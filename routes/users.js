const express = require('express');
const router = express.Router();
const passport = require('passport')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Book = require('../models/Book');
const BookReserve = require('../models/BookReserve');
const LibraryMember = require('../models/LibraryMember');


// GET member dashboard
router.get('/member-dashboard', ensureAuthenticated, (req, res) => 
{
  res.locals.First_Name = req.user.First_Name;
  res.locals.login = req.user.login;
  res.locals.People_ID = req.user.People_ID;
  res.locals.People_Type = req.user.People_Type;
  BookReserve.find({ Borrower_ID: res.locals.People_ID }).then((reservations) => {
      if (!reservations) {
          console.log('here');
      } else {
        res.render('member-dashboard', { 
          name: res.locals.First_Name,
          login: res.locals.login,
          type: res.locals.People_Type,
          reservations: reservations 
        })
      }
  })
});


// GET librarian dashboard
router.get('/librarian-dashboard', ensureAuthenticated, (req, res) => 
{
    res.locals.First_Name = req.user.First_Name;
    res.locals.login = req.user.login;
    res.locals.People_ID = req.user.People_ID;
    res.locals.People_Type = req.user.People_Type;

    Book.find({}, function (err, allDetails) {
      if (err) {
          console.log(err);
      } else {
        res.render('librarian-dashboard', { 
          name: res.locals.First_Name,
          login: res.locals.login,
          type: res.locals.People_Type,
          details: allDetails 
        })
      }
  })
});

// GET system dashboard
router.get('/system-dashboard', ensureAuthenticated, (req, res) => 
{
    res.locals.First_Name = req.user.First_Name;
    res.locals.login = req.user.login;
    res.locals.People_ID = req.user.People_ID;
    res.locals.People_Type = req.user.People_Type;

    LibraryMember.find({}, function (err, allMembers) {
      if (err) {
          console.log(err);
      } else {
        res.render('system-dashboard', { 
          name: res.locals.First_Name,
          login: res.locals.login,
          type: res.locals.People_Type,
          members: allMembers 
        })
      }
  })
});

// GET available books 
router.get("/available-books", ensureAuthenticated, function (req, res) {
  res.locals.First_Name = req.user.First_Name;
  res.locals.login = req.user.login;
  res.locals.People_ID = req.user.People_ID;
  res.locals.People_Type = req.user.People_Type;
  Book.find({}, function (err, allDetails) {
      if (err) {
          console.log(err);
      } else {
        res.render('available-books', { 
          name: res.locals.First_Name,
          login: res.locals.login,
          type: res.locals.People_Type,
          details: allDetails 
        })
      }
  })
});

// Reserve Books
router.post('/reserve', ensureAuthenticated, (req, res) => {
  res.json([{
    isbn: req.body.isbn
  }])
  console.log(req.body.isbn);
  res.locals.First_Name = req.user.First_Name;
  res.locals.login = req.user.login;
  res.locals.People_ID = req.user.People_ID;
  res.locals.isbn = req.body.isbn;
  res.locals.People_Type = req.body.People_Type;
  

  // 
  let bookReserve = new BookReserve({
    Borrower_ID: res.locals.People_ID,
    Reserve_Date: Date.now(),
    ISBN_Code: res.locals.isbn,
    Status: 'N'
  });

  bookReserve.save()
  .then(reserve => {
    req.flash(
      'success_msg',
      'The selected book has been reserved, go to your dashboard to see it.'
    );
    Book.find({}, function (err, allDetails) {
      if (err) {
          console.log(err);
      } else {
        res.redirect('/users/available-books', forwardAuthenticated, { 
          name: res.locals.First_Name,
          login: res.locals.login,
          type: res.locals.People_Type,
          details: allDetails,
          isbn: res.locals.isbn 
        })
      }
    })
  })
})
//   .catch(err => console.log(err));
//   })

// GET borrow
// router.get('/reserve', ensureAuthenticated, (req, res) => 
// {
//     res.locals.First_Name = req.user.First_Name;
//     res.locals.login = req.user.login;
//     res.locals.People_ID = req.user.People_ID;
//     res.locals.People_Type = req.user.People_Type;

//     res.render('available-books', { 
//       name: res.locals.First_Name,
//       login: res.locals.login,
//       type: res.locals.People_Type,
//       id: res.locals.People_ID
//     })
// });


// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});


module.exports = router;