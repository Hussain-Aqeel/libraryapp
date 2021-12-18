const express = require('express');
const router = express.Router();
const passport = require('passport')
const bcrypt = require('bcryptjs');
const { forwardAuthenticated } = require('../config/auth');
const LibraryMember = require('../models/LibraryMember');

// Welcome page
router.get('/', (req, res) => {
  if(req.user) {
    res.locals.login = req.user.login;
    res.locals.First_Name = req.user.First_Name;
    res.locals.People_Type = req.user.People_Type;
    res.render('homepage', { 
      name: res.locals.name,
      login: res.locals.login,
      type: res.locals.People_Type
       
    })
  } else {
    res.render('homepage', {
      name: null,
      login: null,
      type: null
    });
  }
});

// Login Page
router.get('/login', (req, res) => {
  if(req.user) {
    res.locals.login = req.user.login;
    res.locals.First_Name = req.user.First_Name;
    res.locals.People_Type = req.user.People_Type;
    res.render('login', { 
      name: res.locals.name,
      login: res.locals.login,
      type: res.locals.People_Type
       
    })
  } else {
    res.render('login', {
      name: null,
      login: null,
      type: null
    });
  }
});

// Register Page
router.get('/register', (req, res) => { 
  if(req.user) {
    res.locals.login = req.user.login;
    res.locals.First_Name = req.user.First_Name;
    res.locals.People_Type = req.user.People_Type;
    res.render('register', { 
      name: res.locals.name,
      login: res.locals.login,
      type: res.locals.People_Type
       
    })
  } else {
    res.render('register', {
      name: null,
      login: null,
      type: null
    });
  }
});

// Register
router.post('/register', (req, res) => {
  const { firstName, lastName, peopleId, date, sex, department, number, email, password, password2 } = req.body;
  let errors = [];

  if (!firstName || !lastName || !peopleId || !sex || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all important fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (peopleId.length != 10) {
    errors.push({ msg: 'The id must be exactly 10 digits' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      peopleId,
      number,
      sex,
      department,
      email
    });
  } else {
    LibraryMember.findOne({ People_ID: peopleId }).then(member => {
      if (member) {
        errors.push({ msg: 'The ID does already exist' });
        res.render('register', {
          errors,
          firstName,
          lastName,
          peopleId,
          number,
          department,
          sex,
          email,
        });
      } else {
        let type = 2;
        const newMember = new LibraryMember({
          People_ID: peopleId,
          First_Name: firstName,
          Last_Name: lastName,
          People_Type: '2',
          Birth_Date: date,
          Sex: sex,
          Department: department,
          Contact_Number: number,
          Email: email,
          Password: password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newMember.Password, salt, (err, hash) => {
            if (err) {
              console.log(err)
            }
            newMember.Password = hash;
            console.log(newMember)
            newMember
              .save()
              .then(member => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                return res.redirect('/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


// Member Login handle
router.post('/login-member', forwardAuthenticated, (req, res, next) => {
  passport.authenticate('member-local', {
    successRedirect: '/users/member-dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

// Librarian Login handle
router.post('/login-librarian', forwardAuthenticated, (req, res, next) => {
  passport.authenticate('librarian-local', {
    successRedirect: '/users/librarian-dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

// System Login handle
router.post('/login-system', forwardAuthenticated, (req, res, next) => {
  passport.authenticate('system-local', {
    successRedirect: '/users/system-dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

module.exports = router;

