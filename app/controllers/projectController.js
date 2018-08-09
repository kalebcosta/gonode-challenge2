const { Project, Section } = require('../models');

module.exports = {
  async store(req, res, next) {
    try {
      await Project.create({ ...req.body, UserId: req.session.user.id, title: req.body.name });
      req.flash('success', 'Projeto criado com sucesso');
      return res.redirect('/app/dashboard');
    } catch (err) {
      return next(err);
    }
  },
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const { user } = req.session;

      const sections = await Section.findAll({
        where: {
          ProjectId: id,
        },
      });

      const project = await Project.findById(id);

      return res.render('project/show', {
        project, usuario: user.name, sections, id_usuario: user.id,
      });
    } catch (err) {
      return next(err);
    }
  },
  async destroy(req, res, next) {
    try {
      await Project.destroy({ where: { id: req.params.id } });
      req.flash('success', 'Projeto deletado com sucesso');
      return res.redirect('/app/dashboard');
    } catch (err) {
      return next(err);
    }
  },
};
