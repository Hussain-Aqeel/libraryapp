module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/login');
  }
  ,
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    if(req.body.People_Type == 1){
      res.redirect('/users/librarian-dashboard');      
    }
    if(req.body.People_Type == 2){
      res.redirect('/users/member-dashboard');      
    }
    else {
      res.redirect('/users/system-dashboard');      
    }
  }
}