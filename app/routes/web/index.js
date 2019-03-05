const express = require('express');
let router = express.Router();

const adminRouter = require('./admin');
const homeRouter = require('./home');
const redirectIfNotAdmin = require('../../middlewares/redirectIfNotAdmin');

router.use('/admin',redirectIfNotAdmin.handle, adminRouter);
router.use('/', homeRouter);

module.exports = router;