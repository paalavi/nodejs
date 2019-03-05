const passport = require('passport');
const User = require('../models/user');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});



passport.use(new googleStrategy({
  clientID: '205705142797-e0no5rnqc75m27b3gcirijeolarcj89a.apps.googleusercontent.com',
  clientSecret: 'b5lbh06E1jYpgFw-fg6qb5L6',
  callbackURL: "http://localhost:3000/auth/google/callback"
}, (token, refreshToken, profile, done) => {
  User.findOne({email: profile.emails[0].value}, (err, user) => {
    if (err) return done(err);
    if (user) return done(null, user);

    const newUser = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      password: profile.id
    });

    newUser.save(err => {
      if (err) throw err;
      done(null, newUser);
    })

  })
}));