

class RedirectIfAuthenticated {
  async handle(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/');
    next()
  }
}

module.exports = new RedirectIfAuthenticated();