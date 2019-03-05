const express = require('express'),
  router = express.Router(),
  homeController = require('../../controllers/HomeController'),
  redirectIfAuthenticated = require('../../middlewares/redirectIfAuthenticated'),
  requestValidator = require('../../middlewares/validator/requestValidator'),
  passport = require('passport');

//#region reCapcha
let Recaptcha = require('express-recaptcha').Recaptcha;
let recaptcha = new Recaptcha(
  '6LctV5AUAAAAACBkfthui5NONkgicvSaqJzOSGXn',
  '6LctV5AUAAAAAOcWPup3xCNY2CNgHZMIZppkBVqt',
  {'hl': 'fa'}
);
//#endregion

router.get('/', homeController.index);
router.get('/logout', homeController.logout);

//region login
router.get('/login',
  redirectIfAuthenticated.handle,
  // recaptcha.middleware.render,
  homeController.login
);
router.post('/login',
  redirectIfAuthenticated.handle,
  // recaptcha.middleware.verify,
  requestValidator.login(),
  homeController.login_post);
//endregion

//region register
router.get('/register',
  redirectIfAuthenticated.handle,
  // recaptcha.middleware.render,
  homeController.register
);
router.post('/register',
  redirectIfAuthenticated.handle,
  // recaptcha.middleware.verify,
  requestValidator.register(),
  homeController.register_post);
//endregion

//region Google Auth
router.get('/auth/google',
  passport.authenticate('google', {scope: ['profile', 'email']})
);
router.get('/auth/google/callback',
  passport.authenticate('google', {successRedirect: '/',failureRedirect: '/login'})
);
//endregion

//region password
router.get('/resetPassword/reset',
  // recaptcha.middleware.render,
  homeController.resetPssword
);

router.post('/resetPassword/email',
  // recaptcha.middleware.verify,
  requestValidator.resetPassword(),
  homeController.sendResetEmail
);

router.get('/resetPassword/reset/:token',homeController.resetPssword);
router.post('/resetPassword/reset',homeController.resetPssword_post);
//endregion



module.exports = router;