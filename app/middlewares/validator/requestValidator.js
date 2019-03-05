const {check} = require('express-validator/check');
const controller = require('../../controllers/controller');
class RequestValidator extends controller{

  login(req, res, next) {
    return [
      check('email')
        .not().isEmpty().withMessage('لطفا فیلد ایمیل را کامل بفرمایید')
        .isEmail().withMessage('ایمیل وارد شده معتیر نیست'),
      check('password')
        .not().isEmpty().withMessage('لطفا فیلد پسورد را کامل بفرمایید')
        .isLength({min: 5}).withMessage('پسوورد باید بیشتر از 5 کارکتر باشد')
    ]
  }

  register(req, res, next) {
    return [
      check('name')
        .isLength({min:4}).withMessage('نام کاربری باید بیشتر از 4 کارکتر باشد'),
      check('email')
        .not().isEmpty().withMessage('لطفا فیلد ایمیل را کامل بفرمایید')
        .isEmail().withMessage('ایمیل وارد شده معتیر نیست'),
      check('password')
        .not().isEmpty().withMessage('لطفا فیلد پسورد را کامل بفرمایید')
        .isLength({min: 5}).withMessage('پسوورد باید بیشتر از 5 کارکتر باشد')
    ]
  }

  resetPassword(req, res, next) {
    return [
      check('email')
        .not().isEmpty().withMessage('لطفا فیلد ایمیل را کامل بفرمایید')
        .isEmail().withMessage('ایمیل وارد شده معتیر نیست'),
    ]
  }
}

module.exports =new RequestValidator();