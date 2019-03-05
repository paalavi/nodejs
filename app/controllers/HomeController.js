const controller = require('./controller');
const User = require('../models/user');
const uniqueString = require('unique-string');
const ResetPassword = require('../models/resetPassword');
const q = require('q');
const bcrypt = require('bcrypt');
const passport = require('passport');
const {validationResult} = require('express-validator/check');

class HomeController extends controller {
  index(req, res) {
    res.render('home/home')
  }

  login(req, res) {
    let errors = req.flash('errors');
    res.render('home/login', {messages: errors, recaptcha: res.recaptcha})
  }

  login_post(req, res, next) {
    // if (req.recaptcha.error) {
    //   req.flash('errors', 'لطفا تیک فیلد مربوط به تشخیص بات گوگل را بزنید');
    //   return res.redirect('/login')
    // }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array().map(x => x.msg));
      return res.redirect('/login');
    }
    this.passportLogin(req, res, next);
  }

  register(req, res) {
    let errors = req.flash('errors');
    res.render('home/register', {messages: errors, recaptcha: res.recaptcha})
  }

  register_post(req, res, next) {
    // if (req.recaptcha.error) {
    //   req.flash('errors', 'reCapcha Error');
    //   res.redirect('/register')
    // }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array().map(x => x.msg));
      return res.redirect('/register');
    }
    this.passportRegister(req, res, next)
  }

  logout(req, res) {
    req.logout();
    res.clearCookie('rememberToken');
    res.redirect('/')
  }

  passportLogin(req, res, next) {
    return passport.authenticate('local-login', (err, user) => {
      if (user) {
        req.login(user, function (err) {
          if (err) console.log(err);
          if (req.body.remember === 'on') {
            user.setToken(res);
          }
          return res.redirect('/');
        });
      }
      else res.redirect('/login')
    })(req, res, next)
  }

  passportRegister(req, res, next) {
    return passport.authenticate('local-register', (err, user) => {
      if (user) {
        req.login(user, function (err) {
          if (err) console.log(err);
          return res.redirect('/');
        })
      }
      else res.redirect('/register');
    })(req, res, next)
  }

  resetPssword(req, res, next) {
    if (req.params.token) {
      return res.render('home/resetForm', {token: req.params.token, email: req.params.email})
    }
    const errors = req.flash('errors');
    res.render('home/resetPassword', {messages: errors, recaptcha: req.recaptcha})
  }

  async sendResetEmail(req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array().map(x => x.msg));
      return res.redirect('/resetPassword/reset');
    }

    let user = await User.find({email: req.body.email});
    if (!user) {
      req.flash('errors', 'ایمیل وارد شده در سیستم وجود ندارد')
    }

    let token = uniqueString();
    let hashedToken = await bcrypt.hash(token, 10);

    let newResetPassword = new ResetPassword({
      email: req.body.email,
      token: token
    })
    newResetPassword.save(err => console.log(err));
    //todo : sendEmail
    res.redirect(`/resetPassword/reset/${token}`)
  }

  async resetPssword_post(req, res, next) {
    try {
      //validate form
      let resetPasswordModel = await ResetPassword.findOne({email: req.body.email, token: req.body.token})
      if (!resetPasswordModel) {
        req.flash('errors', 'ایمیل ورودی درست نمیباشد')
        return res.redirect('/resetPassword/reset');
      }
      if (resetPasswordModel.use) {
        req.flash('errors', 'از لینک بازیابی استفاده شده است لطفا با لینک صحبح وارد شوید')
        return res.redirect('/resetPassword/reset');
      }
      // let tokenCompare = await bcrypt.compare(req.body.token, resetPasswordModel.token);
      // if (!tokenCompare) {
      //   req.flash('errors', 'لینک بازیابی صحیح نمیباشد')
      //   res.redirect('/resetPassword/reset');
      // }

      //update user pass and make "use" param to true
      await User.findOneAndUpdate({email: req.body.email}, {password: req.body.password})
      resetPasswordModel.use = true;
      await resetPasswordModel.save();
      req.flash('errors', 'پسورد با موفقیت تعویض گردید لطفا با پسورد جدید وارد شوید')
      res.redirect('/login');
    }
    catch (err) {
      req.flash('errors', 'عملیات بازیابی رمز عبور با خطا مواجه شد لطفا مجددا سعی بفرمایید')
      res.redirect('/login');
    }
  }
}

module.exports = new HomeController;