const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/User');
const LibraryMember = require('../models/LibraryMember');
const Librarian = require('../models/Librarian');
const System = require('../models/System');

module.exports = function (passport) 
{
  passport.use(
    new LocalStrategy( { usernameField: 'email' }, (email, password, done) => {
      // Match User
      User.findOne({ email: email })
        .then(user => {
          if(!user) {
            return done(null, false, { message: 'That email is not registered' })
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;

            if(isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' })
            }
          });
        })
        .catch(err => console.log(err))
    })
  );

  passport.use('member-local',
    new LocalStrategy({ usernameField: 'id' }, (id, password, done) => {
      // Match User
      LibraryMember.findOne({ People_ID: id })
        .then(member => {
          if(!member) {
            return done(null, false, { message: 'That id is not registered as a member.' })
          }

          // Match password
          bcrypt.compare(password, LibraryMember.Password, (err, isMatch) => {
            if(err) throw err;

            if(isMatch) {
              return done(null, member);
            } else {
              return done(null, false, { message: 'Password incorrect' })
            }
          });
        })
        .catch(err => console.log(err))
    })
  );

  passport.use('librarian-local',
    new LocalStrategy({ usernameField: 'id' }, (id, password, done) => {
      // Match User
      Librarian.findOne({ People_ID: id })
        .then(librarian => {
          if(!librarian) {
            return done(null, false, { message: 'That id is not registered as a librarian.' })
          }

          // Match password
          bcrypt.compare(password, Librarian.Password, (err, isMatch) => {
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
  new LocalStrategy({ usernameField: 'id' }, (id, password, done) => {
    // Match User
    System.findOne({ People_ID: id })
      .then(system => {
        if(!system) {
          return done(null, false, { message: 'That id is not registered as a system.' })
        }

        // Match password
        bcrypt.compare(password, System.Password, (err, isMatch) => {
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


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // passport.deserializeUser(function(id, done) {
  //   User.findById(id, function (err, user) {
  //     done(err, user);
  //   });
  // });

  passport.deserializeUser((login, done) => {
    if (login.People_Type === 1) {
        Librarian.findById(login, function (err, librarian) {
            if (librarian)
                done(null, librarian);
            else
                done(err, { message: 'Librarian not found' })
        });
    }
    else if (login.People_Type === 2) {
        LibraryMember.findById(login, (err, member) => {
            if (member)
                done(null, member);
            else
                done(err, { message: 'Member not found' })
        });
    }
    else if (login.People_Type === 4) {
      System.findById(login, (err, system) => {
          if (system)
              done(null, system);
          else
              done(err, { message: 'System not found' })
      });
    }
    else {
        done({ message: 'No entity found' }, null);
    }
  });

}