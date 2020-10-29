const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome page
router.get('/', (req, res) => {
  if(res.locals.name !== undefined ) {
    // res.locals.name = req.user.name;
    res.render('homepage', { name: res.locals.name })
  } else {
    res.render('homepage');
  }
});

// // dashboard page
// router.get('/dashboard', ensureAuthenticated, (req, res) => 
// { 
//   if(res.locals.name != undefined ) {
//     res.locals.name = req.user.name;
//     res.render('dashboard', { name: res.locals.name })
//   } else {
//     res.render('dashboard');
//   }
// });

module.exports = router;

