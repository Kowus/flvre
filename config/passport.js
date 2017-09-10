var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users.model');

module.exports = function (passport) {
    // Serialize User
    passport.serializeUser(function (req, user, done) {
        done(null, user.id);
    });
    //	Deserialize User
    passport.deserializeUser(function (req, id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            // async. User.findOne() won't fire until data is sent back
            process.nextTick(function () {
                //	Check to see if there's already a record of user
                User.findOne({'auth.local.email': email}, function (err, user) {
                    if (err) return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email has already been used with an account.'))
                    } else {
                        //	User doesn't already exist
                        //	Create User
                        var newUser = new User();

                        //	set User's local credentials
                        newUser.auth.local.email = email;
                        newUser.auth.local.password = newUser.generateHash(password);
                        newUser.auth.local.firstname = req.body.firstname;
                        newUser.auth.local.lastname = req.body.lastname;

                        //	save the user
                        newUser.save(function (err) {
                            if (err) throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));


    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            //	If user exists
            User.findOne({'auth.local.email': email}, function (err, user) {
                if (err) return done(err);
                //	If user doesn't exist
                if (!user) return done(null, false, req.flash('loginMessage', 'No user found'));

                //	If user found but password is wrong
                if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Username or Password incorrect'));
                req.session.user_role = "user";
                return done(null, user);
            });
        }
    ));


};