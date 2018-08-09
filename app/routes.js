const express = require('express');
const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const projectController = require('./controllers/projectController');
const sectionController = require('./controllers/sectionController');

const authMiddleware = require('./middlewares/auth');
const guestMiddleware = require('./middlewares/guest');
const emptyMiddleware = require('./middlewares/empty');
const exclusiveMiddleware = require('./middlewares/exclusive');

const routes = express.Router();

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});

// AUTH

routes.get('/', guestMiddleware, authController.signin);
routes.get('/signup', guestMiddleware, authController.signup);
routes.get('/signout', authController.signout);
routes.post('/register', authController.register);
routes.post('/authenticate', authController.authenticate);

// DASHBOARD
routes.use('/app', authMiddleware);
routes.get('/app/dashboard', dashboardController.index);

// PROJECTS
routes.post('/app/projects/create', emptyMiddleware, projectController.store);
routes.get('/app/:userId/projects/:id', exclusiveMiddleware, projectController.show);
routes.delete('/app/:userId/projects/:id', exclusiveMiddleware, projectController.destroy);

// SECTIONS
routes.post('/app/:projectId/section/create', emptyMiddleware, sectionController.store);
routes.get('/app/:userId/project/:projectId/:sectionId', exclusiveMiddleware, sectionController.show);
routes.put('/app/:userId/project/:projectId/:sectionId', exclusiveMiddleware, sectionController.update);
routes.delete('/app/:userId/project/:projectId/:sectionId', exclusiveMiddleware, sectionController.destroy);


// ERRORS
routes.use((req, res) => res.render('errors/404'));
routes.use((err, req, res, _next) => {
  res.status(err.status || 500);

  return res.render('errors/index', {
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

module.exports = routes;
