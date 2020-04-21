'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => {
    User.findOne({'email': email}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            console.log('user with this email already exist');
            return done(null, false);
        }

        User.findOne({'username': req.body.username}, (err, user) => {
            if (err) {
                return done(err);
            }
            if (user) {
                console.log('user with this username already exist');
                return done(null, false);
            }
        });
        
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.save((err) => {
            done(null, newUser);
        });
    });
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => {
    User.findOne({'email': email}, (err, user) => {
        if (err) return done(err);
        if(!user || !user.validUserPassword(password)){
            return done(null, false);
        }
        return done(null, user);
    });
}));