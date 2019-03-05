const controller = require('../controller');
const Course = require('../../models/course');
const Episode = require('../../models/episode');

const {validationResult} = require('express-validator/check');

class episodeController extends controller {
  async index(req, res) {
    let page = parseInt(req.query.page) || 1;
    let episodes = await Episode.paginate({}, {page: page, limit: 10, sort: {createdAt: 1}});
    res.render('admin/episodes/index', {episodes: episodes, pagination: {pages: episodes.pages, page: episodes.page}})
  }

  async create(req, res) {
    let courses = await Course.find({});
    res.render('admin/episodes/create', {messages: req.flash('errors'), courses: courses})
  }

  async create_post(req, res, next) {
    try {
      //validation data
      let errors = await validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(x => x.msg));
        return res.redirect('/admin/episodes/create');
      }
      //create episode
      let newCourse = new Episode(req.body);
      await newCourse.save();
      res.redirect('/admin/episodes')
    } catch (err) {
      res.render('admin/episodes/create', {messages: req.flash('errors', err)})
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id || undefined;
      //find Course
      let episode = await Episode.findOne({_id: id});
      if (!episode) {
        req.flash('errors', 'عملیت حذف با خطا روبرو شد');
        return res.render('admin/episodes')
      }
      //delete episode
      await episode.remove();
      //
      res.redirect('/admin/episodes')
    }
    catch (err) {
      req.flash('errors', 'عملیت حذف با خطا روبرو شد');
      return res.redirect('/admin/episodes')
    }
  }

  async edit(req, res, next) {
    try {
      const id = req.params.id || undefined;
      //find course
      let episode = await Episode.findOne({_id: id});
      let courses = await Course.find({});
      if (!episode) {
        req.flash('errors', 'چنین شناسه ای برای کلاس ها وجود ندارد');
        return res.redirect('/admin/episodes');
      }
      //send course to edit view
      res.render('admin/episodes/edit', {courses: courses, episode: episode._doc, messages: req.flash('errors')})
    } catch (err) {
      req.flash('errors', 'چنین شناسه ای برای کلاس ها وجود ندارد');
      return res.redirect('/admin/episodes');
    }
  }

  async update(req, res, next) {
    let errors = await validationResult(req);
    if (!errors) {
      req.flash('errors', errors.array().map(x => x.msg));
      return res.redirect('/admin/episodes/edit');
    }
    req.body.slug = req.body.title.replace(' ', '-');
    await Episode.findByIdAndUpdate(req.body.id, {$set: {...req.body}});
    return res.redirect('/admin/episodes');
  }
}

module.exports = new episodeController;