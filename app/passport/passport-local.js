const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use('local-register',
  new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async function (req, email, password, done) {
      try {
        let user = await User.findOne({email: email});
        if (user) return done(null, false, req.flash('errors', 'چنین کاربری قبلا ثبت نام کرده است'));
        let newUser = new User({
          name: req.body.name,
          password: password,
          email: email
        });
        await newUser.save();
        return done(null, newUser);
      }
      catch (err) {
        done(err, false, req.flash('errors', 'ثبت نام با موفقیت انجام نشد لطفا مجددا سعی کنید'));
      }
    }
  ));

passport.use('local-login',
  new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async function (req, email, password, done) {
      try {
        let user = await User.findOne({email: email});
        if (!user) return done(null, false, req.flash('errors', 'نام کاربری اشتباه است'));
        let validateUser = await user.validatePassword(password);
        if(!validateUser)  return done(null, false, req.flash('errors', 'نام کاربری یا رمز عبور اشتباه است'));
        return done(null, user);
      }
      catch (err) {
        done(err, false, req.flash('errors', 'ثبت نام با موفقیت انجام نشد لطفا مجددا سعی کنید'));
      }
    }
  ));
