module.exports = {
  notAllowAnonymous: function (req, res, next) {
    if (req.session.authenticated) {
      console.log(req.session.authenticated);
      next();
    } else {
      res.redirect("/");
    }
  },
};
