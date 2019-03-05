const controller = require('../controller');
const Course = require('../../models/course');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const {validationResult} = require('express-validator/check');

class AdminController extends controller {
  async index(req, res) {
    let page = parseInt(req.query.page) || 1;
    let courses = await Course.paginate({}, {page: page, limit: 10, sort: {createdAt: 1}});
    res.render('admin/courses/index', {courses: courses, pagination: {pages: courses.pages, page: courses.page}})
  }

  create(req, res) {
    res.render('admin/courses/create', {messages: req.flash('errors')})
  }

  async create_post(req, res, next) {
    try {
      //validation data
      req.body.images = (req.file) ? req.file.originalname : '';
      let errors = await validationResult(req);
      if (!errors.isEmpty()) {
        if (req.file) fs.unlink(req.file.path, (err) => {
        });
        req.flash('errors', errors.array().map(x => x.msg));
        return res.redirect('/admin/courses/create');
      }
      let imageDetails = path.parse(req.file.path);
      //create courses
      let images = {};
      images['original'] = req.file.destination + '/' + req.file.filename;
      [1080, 720, 480].forEach(async size => {
        images[size] = req.file.destination + '/' + size + '_' + req.file.filename;
        await sharp(req.file.destination + '/' + req.file.filename).resize(size, null).toFile(req.file.destination + '/' + size + '_' + req.file.filename);
      });
      let {title, type, body, price, tags} = req.body;
      let newCourse = new Course({
        user: req.user._id,
        slug: title.replace(' ', '-'),
        title,
        type,
        body,
        images,
        thumb: images['480'],
        price,
        tags
      });
      await newCourse.save();
      res.redirect('/admin/courses')
    } catch (err) {
      res.render('admin/courses/create', {messages: req.flash('errors', err)})
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id || undefined;
      //find Course
      let course = await Course.findOne({_id: id});
      if (!course) {
        req.flash('errors', 'عملیت حذف با خطا روبرو شد');
        return res.render('admin/courses')
      }
      //delete Images
      Object.values(course.images).forEach(imageUrl => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(imageUrl)
        }
      });
      //delete Course
      await course.remove();
      //
      res.redirect('/admin/courses')
    }
    catch (err) {
      req.flash('errors', 'عملیت حذف با خطا روبرو شد');
      return res.redirect('/admin/courses')
    }
  }

  async edit(req, res, next) {
    try {
      const id = req.params.id || undefined;
      //find course
      let course = await Course.findOne({_id: id});
      if (!course) {
        req.flash('errors', 'چنین شناسه ای برای کلاس ها وجود ندارد');
        return res.redirect('/admin/courses');
      }
      //send course to edit view
      res.render('admin/courses/edit', {course: course._doc, messages: req.flash('errors')})
    } catch (err) {
      req.flash('errors', 'چنین شناسه ای برای کلاس ها وجود ندارد');
      return res.redirect('/admin/courses');
    }
  }

  async update(req, res, next) {
    let errors = await validationResult(req);
    if (!errors) {
      if (req.file) fs.unlinkSync(req.file.path);
      req.flash('errors', errors.array().map(x => x.msg));
      return res.redirect('/admin/courses/create');
    }

    let objForUpdate = {};

    // set image thumb
    objForUpdate.thumb = req.body.imagesThumb;

    // check image
    if (req.file) {
      let images = {};
      images['original'] = req.file.destination + '/' + req.file.filename;
      [1080, 720, 480].forEach(async size => {
        images[size] = req.file.destination + '/' + size + '_' + req.file.filename;
        await sharp(req.file.destination + '/' + req.file.filename).resize(size, null).toFile(req.file.destination + '/' + size + '_' + req.file.filename);
      });
      objForUpdate.images = images;
      objForUpdate.thumb = objForUpdate.images['480'];
    }

    delete req.body.images;
    delete req.body._method;
    objForUpdate.slug = req.body.title.replace(' ', '-');

    await Course.findByIdAndUpdate(req.body.id, {$set: {...req.body, ...objForUpdate}});
    return res.redirect('/admin/courses');
  }
}

module.exports = new AdminController;