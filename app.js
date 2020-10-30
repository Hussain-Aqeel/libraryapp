const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer'); 

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
// This line of code is to exclude the pages that we don't wanna wrap in the container or the deafult layout
app.set('layout homepage', false);
app.set('layout cars', false);
app.set('layout dashboard', false);
app.set('layout contact', false);
app.set('layout about', false);
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

// Connect flash
app.use(flash());

// Glabal vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  // res.locals.name = req.flash('name');
  res.locals.name = req.body.name;
  res.locals.email = req.body.email;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use("/img", express.static("./img"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));