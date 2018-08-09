module.exports = (req, res, next) => {
  if (req.session.user.id == req.params.userId) {
    return next();
  }

  return res.redirect('/');
};
