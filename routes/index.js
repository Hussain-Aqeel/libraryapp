const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome page
router.get('/homepage', (req, res) => res.render('homepage'));

// Welcome page
router.get('/dashboard', ensureAuthenticated, (req, res) => 
  res.render('dashboard', {
    name: req.user.name
  }));

module.exports = router;

