const { Section, Project } = require('../models');

module.exports = {
  async store(req, res, next) {
    try {
      const { projectId } = req.params;
      const { user } = req.session;

      await Section.create({
        ...req.body, ProjectId: projectId, title: req.body.name,
      });

      req.flash('success', 'Seção criada com sucesso');

      return res.redirect(`/app/${user.id}/projects/${projectId}`);
    } catch (err) {
      return next(err);
    }
  },

  async show(req, res, next) {
    try {
      const { projectId, sectionId } = req.params;
      const { user } = req.session;

      const sections = await Section.findAll({
        where: {
          ProjectId: projectId,
        },
      });

      const section = await Section.findById(sectionId);
      const project = await Project.findById(projectId);

      return res.render('section/show', {
        project,
        sections,
        currentSection: section,
        id_projeto: projectId,
        id_usuario: user.id,
        usuario: user.name,
        activeSection: sectionId,
      });
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const { sectionId, userId, projectId } = req.params;
      await Section.destroy({ where: { id: sectionId } });
      req.flash('success', 'Seção deletada com sucesso');
      return res.redirect(`/app/${userId}/projects/${projectId}`);
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { sectionId, userId, projectId } = req.params;
      const section = await Section.findById(sectionId);
      await section.update(req.body);

      req.flash('success', 'Seção editada com sucesso');
      return res.redirect(`/app/${userId}/project/${projectId}/${sectionId}`);
    } catch (err) {
      return next(err);
    }
  },
};
