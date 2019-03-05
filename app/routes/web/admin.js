const express = require('express');
let router = express.Router();
const adminController = require('../../controllers/admin/adminController');
const courseController = require('../../controllers/admin/courseController');
const episodeController = require('../../controllers/admin/episodeController');
const courseValidator = require('../../middlewares/validator/courseValidator');
const episodeValidator = require('../../middlewares/validator/episodeValidator');
const uploadHelper = require('../../middlewares/fileUpload/uploadHelper');

router.get('/', adminController.index);


//courses
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


//episodes
router.get('/episodes', episodeController.index);
router.get('/episodes/create', episodeController.create);
router.post('/episodes/create', episodeValidator.handle(), episodeController.create_post);
router.get('/episodes/:id/delete', episodeController.delete);
router.get('/episodes/:id/edit', episodeController.edit);
router.post('/episodes/update',
  episodeValidator.handle(),
  episodeController.update
);

module.exports = router;