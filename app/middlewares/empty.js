module.exports = (req, res, next) => {
  if (req.body.name) {
    return next();
  }

  req.flash('error', 'Nome vazio');
  return res.redirect('back');
};
