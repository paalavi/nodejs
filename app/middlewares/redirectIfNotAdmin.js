

class RedirectIfNotAdmin {
  handle(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) next();
    else return res.redirect('/')
  }
}

module.exports = new RedirectIfNotAdmin();