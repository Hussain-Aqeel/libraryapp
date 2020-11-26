const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

// Passport (Authentication library) Config 
require('./config/passport')(passport);

// Database Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
// use app.set('layout {name}', false) 
// to exclude the pages that we don't wanna 
// wrap in the deafult layout


// Bodyparser
app.use(express.urlencoded(
  { extended: false }
));

// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash - to implement temporary messages 
// like error messages
app.use(flash());


// Glabal vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.name = req.body.name;
  res.locals.email = req.body.email;
  res.locals.login = req.isAuthenticated();
  // res.locals.users = db.users;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use("/img", express.static("./img"));

// Social media redirection
app.get("/twitter", (req, res) => {
  res.status(301).redirect("https://www.twitter.com")
});
app.get("/facebook", (req, res) => {
  res.status(301).redirect("https://www.facebook.com")
});
app.get("/pinterest", (req, res) => {
  res.status(301).redirect("https://www.pinterest.com")
});
app.get("/instagram", (req, res) => {
  res.status(301).redirect("https://www.instagram.com")
});
app.get("/linkedin", (req, res) => {
  res.status(301).redirect("https://www.linkedin.com")
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));