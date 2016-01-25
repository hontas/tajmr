import passport from 'passport';
import users from '../lib/users';
import intervals from '../lib/intervals';

const passportOptions = {
  successRedirect: '/',
  failureRedirect: '/login'
};

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Not authenticated. Please log in.' });
}

module.exports = function routes(app) {

  app.get('/login', (req, res) => res.render('login'));
  app.get('/register', (req, res) => res.render('register'));

  app.post('/login', passport.authenticate('local', passportOptions));
  app.post('/register', users.post);

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/user', users.get);
  app.put('/api/user', isAuthenticated, users.put);

  app.post('/api/intervals', isAuthenticated, intervals.create);
  app.get('/api/intervals', isAuthenticated, intervals.findAll);
  app.get('/api/intervals/:id', isAuthenticated, intervals.findOne);
  app.put('/api/intervals/:id', isAuthenticated, intervals.update);
  app.delete('/api/intervals/:id', isAuthenticated, intervals.remove);

  app.get('/', (req, res) => res.render('index'));
};
