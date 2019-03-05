const express = require('express');
let router = express.Router();
const adminController = require('../../controllers/admin/adminController');
const courseController = require('../../controllers/admin/courseController');
const courseValidator = require('../../middlewares/validator/courseValidator');
const uploadHelper = require('../../middlewares/fileUpload/uploadHelper');

router.get('/', adminController.index);

router.get('/courses', courseController.index);

router.get('/courses/create', courseController.create);
router.post('/courses/create', uploadHelper.single('images'), courseValidator.handle(), courseController.create_post);

router.get('/courses/:id/delete', courseController.delete);

router.get('/courses/:id/edit', courseController.edit);
router.post('/courses/edit',
  uploadHelper.single('images'),
  courseValidator.handle(),
  courseController.update
);

module.exports = router;