const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User Model
const LibraryMember = require('../models/LibraryMember');
const Librarian = require('../models/Librarian');
const System = require('../models/System');

function SessionConstructor(userId, userGroup, details) {
  this.userId = userId;
  this.userGroup = userGroup;
  this.details = details;
}

module.exports = function (passport) 
{

  passport.serializeUser(function (userObject, done) {

    // userObject could be a member or a librarian or a system.

    let userGroup = "member";

    let userPrototype =  Object.getPrototypeOf(userObject);


    if (userPrototype === LibraryMember.prototype) {
      userGroup = "member";

    } 
    else if (userPrototype === Librarian.prototype) {
      userGroup = "librarian";
    }

    else if (userPrototype === System.prototype) {

      userGroup = "system";

    }

    let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');

    done(null,sessionConstructor);

  });


  passport.deserializeUser(function (sessionConstructor, done) {


    if (sessionConstructor.userGroup == 'member') {

      LibraryMember.findOne({

          _id: sessionConstructor.userId

      }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.

          done(err, user);

      });

    } else if (sessionConstructor.userGroup == 'librarian') {

      Librarian.findOne({

          _id: sessionConstructor.userId

      }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.

          done(err, user);

      });

    } else if (sessionConstructor.userGroup == 'system') {

      System.findOne({

          _id: sessionConstructor.userId

      }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.

          done(err, user);

      });

    }
  });


  passport.use('member-local',
    new LocalStrategy({ 
      usernameField: 'member-id',
      passwordField: 'member-password'}, (username, password, done) => {
        console.log(username);
        console.log(password);
      // Match User
      LibraryMember.findOne({ People_ID:username })
        .then(member => {
          console.log(member)
          if(!member) {
            return done(null, false, { message: 'That id is not registered as a member.' })
          }

          // Match password
          bcrypt.compare(password, member.Password, (err, isMatch) => {
            if(err) {
              console.log(err);
              throw err;
            }
            if(isMatch) {
              return done(null, member);
            } else {
              console.log(username)
              console.log(password)
              return done(null, false, { message: 'Password incorrect' })
            }
          });
        })
        .catch(err => console.log(err))
    })
  );

  passport.use('librarian-local',
    new LocalStrategy({ 
      usernameField: 'librarian-id',
      passwordField: 'librarian-password'}, (username, password, done) => {
      // Match User
      Librarian.findOne({ People_ID: username })
        .then(librarian => {
          console.log(librarian)
          if(!librarian) {
            return done(null, false, { message: 'That id is not registered as a librarian.' })
          }

          // Match password
          bcrypt.compare(password, librarian.Password, (err, isMatch) => {
            if(err) throw err;

            if(isMatch) {
              return done(null, librarian);
            } else {
              return done(null, false, { message: 'Password incorrect' })
            }
          });
        })
        .catch(err => console.log(err))
    })
  );

  passport.use('system-local',
  new LocalStrategy({ 
    usernameField: 'system-id',
    passwordField: 'system-password'}, (id, password, done) => {
    // Match User
    System.findOne({ People_ID: id })
      .then(system => {
        console.log(system)
        if(!system) {
          return done(null, false, { message: 'That id is not registered as a system.' })
        }

        // Match password
        bcrypt.compare(password, system.Password, (err, isMatch) => {
          if(err) throw err;

          if(isMatch) {
            return done(null, system);
          } else {
            return done(null, false, { message: 'Password incorrect' })
          }
        });
      })
      .catch(err => console.log(err))
    })
  );

}