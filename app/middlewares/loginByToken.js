let User = require('../models/user');

class LoginByToken {
  async handle(req, res, next) {
    try {
      if (!req.isAuthenticated()) {
        let rememberToken = req.signedCookies.rememberToken;
        if (rememberToken) {
          console.log('rememberToken',rememberToken);
          let user = await User.findOne({rememberToken: rememberToken});
          console.log('user',user);
          if (user) {
            req.login(user, function (err) {
              if (err) return next(err);
              console.log('user Logged In');
            })
          }
        }
      }
      next()
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = new LoginByToken();