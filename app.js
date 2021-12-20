const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const csp = require('express-csp-header');
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


// Body-parser
app.use(express.urlencoded(
  { extended: true }
));
app.use(express.json());       // to support JSON-encoded bodies

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

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
  res.locals.First_Name = req.First_Name;
  res.locals.People_ID = req.body.People_ID;
  res.locals.People_Type = req.body.People_Type;
  res.locals.isbn = req.body.isbn;
  res.locals.status = req.body.status;
  res.locals.deletedID = req.body.deletedID;
  res.locals.login = req.isAuthenticated();
  // res.locals.users = db.users;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use("/img", express.static("./img"));


const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
// other app.use() options ...
app.use(expressCspHeader({ 
    policies: { 
        'default-src': [expressCspHeader.NONE], 
        'img-src': [expressCspHeader.SELF], 
    } 
}));  

const cors = require('cors'); 
app.use(cors());


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));