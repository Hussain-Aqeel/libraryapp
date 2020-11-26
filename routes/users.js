const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');
const { ensureAuthenticated } = require('../config/auth');
const ObjectID = require('mongodb').ObjectID;

// User model
const User = require('../models/User');

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

// checkout page
router.get('/checkout', (req, res) => 
{ 
  res.locals.name = req.user.name;
  res.locals.email = req.user.email;
  res.render('checkout', { name: res.locals.name }); 
});

// Register Page
router.get('/register', (req, res) => res.render('register'));

// About Page
router.get('/about', (req, res) => {
  if(req.user) {
    res.locals.name = req.user.name;
    res.render('about', { 
      name: res.locals.name,
      login: res.locals.login 
    })
  } else {
    res.render('about');
  }
});

// Contact Page
router.get('/contact', (req, res) => {
  if(req.user) {
    res.locals.name = req.user.name;
    res.render('contact', { 
      name: res.locals.name,
      login: res.locals.login 
    })
  } else {
    res.render('contact');
  }
});

// Cars Page
router.get('/cars', (req, res) => {
  if(req.user) {
    res.locals.name = req.user.name;
    res.render('cars', { 
      name: res.locals.name,
      login: res.locals.login 
    })
  } else {
    res.render('cars');
  }
});

// Register Handle
router.post('/register', (req, res) => {
  const { name, email, password, password2} = req.body;
  let errors = [];

  // Check required fields
  if(!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields.' });
  }

  // Check passwords match
  if(password !== password2) {
    errors.push({ msg: 'Passwords do not match.' });
  }

  // Check pass length
  if(password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters.'});
  }

  if(errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passed
    const status = 'customer';
    const cars = null;
    User.findOne({ email: email })
    .then(user =>{
      if(user) {
        // User exists
        errors.push({ msg: 'Email is already registered.' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          status,
          cars
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) => 
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;

            // set password to hashed
            newUser.password = hash;

            // save user
            newUser.save()
              .then(user => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login');
              })
              .catch( err => console.log(err) );
        }) )
      }    
      
    });
  }
});

// Login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
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

// contact handle - nodemailer
router.post('/send', (req, res) => {
  const { name, email, phone, subject, message} = req.body;
  let errors = [];

  // Check required fields
  if(!name || !email || !phone || !subject || !message) {
    errors.push({ msg: 'Please fill in all fields.' });
  }

  if(errors.length > 0) {
    res.render('contact', {
      errors,
      name,
      email,
      phone,
      subject, 
      message
    });
  } else {
    const output = 
  `<p> You have a new contact request </p>
    <h3>Contact Details</h3>
    <br><br>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone Number: ${req.body.phone}</li>
      <li>Subject: ${req.body.subject}</li>
    </ul>
    <br><br>
    <h3>Message</h3>
    <br>
    <p>${req.body.message}</p>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'h.aljassim.1999@gmail.com', // generated ethereal user
        pass: '1267490hh', // generated ethereal password
      },
      tls:{
        rejectUnauthorized: false
      }
    });

    // send mail with defined transport object
    let info = transporter.sendMail({
      from: '"Luxury Cars App" <h.aljassim.1999@gmail.com>', // sender address
      to: "s201779630@kfupm.edu.sa, hussain@ljassim.tech", // list of receivers
      subject: "Luxury Cars - contact form", // Subject line
      text: " ", // plain text body
      html: output // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    req.flash('success_msg', 'Your email has been sent! we are looking forward to hear you out.');
    res.redirect('/users/contact');
  }
});

// router.post('/editName', (req, res) => {
//   const name = document.getElementById('name');

//   if(name != '') {
//     User.findById(req.user.id, function (err, user) {
//       user.name = name;
//       user.local.name = name; 
  
//       // don't forget to save!
//       user.save(function (err) {
//           res.redirect('/account-info');
//       });
//     });
//   }
// });

// router.put('/update', function(req, res, next) {
//   let name = req.body.name;

// });
// router.post('/editEmail', (req, res) => {


// });
// router.post('/editPassword', (req, res) => {


// });

module.exports = router;