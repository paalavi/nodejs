const controller = require('../../controllers/controller');

const { check } = require('express-validator/check');

class episodeValidator extends controller {

  handle() {
    return [
      check('title')
        .isLength({ min : 5 })
        .withMessage('عنوان نمیتواند کمتر از 5 کاراکتر باشد'),

      check('type')
        .not().isEmpty()
        .withMessage('فیلد نوع دوره نمیتواند خالی بماند'),

      check('course')
        .not().isEmpty()
        .withMessage('فیلد دوره مربوطه نمیتواند خالی بماند'),

      check('body')
        .isLength({ min : 20 })
        .withMessage('متن دوره نمیتواند کمتر از 20 کاراکتر باشد'),

      check('videoUrl')
        .not().isEmpty()
        .withMessage(' لینک دانلود نمیتواند خالی بماند'),

      check('number')
        .not().isEmpty()
        .withMessage('شماره جلسه نمیتواند خالی بماند'),
    ]
  }


  slug(title) {
    return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
  }
}

module.exports = new episodeValidator();