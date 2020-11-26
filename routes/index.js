const express = require('express');
const router = express.Router();

// Welcome page
router.get('/', (req, res) => {
  if(req.user) {
    res.locals.name = req.user.name;
    res.render('homepage', { 
      name: res.locals.name,
      login: res.locals.login 
    })
  } else {
    res.render('homepage');
  }
});

module.exports = router;

