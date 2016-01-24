import passport from 'passport';
import users from '../lib/users';

const passportOptions = {
  successRedirect: '/',
  failureRedirect: '/login'
};

module.exports = function routes(app) {

  app.get('/login', (req, res) => res.render('login'));
  app.get('/register', (req, res) => res.render('register'));

  app.post('/login', passport.authenticate('local', passportOptions));
  app.post('/register', users.post);

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    res.status(401).json({});
  });

  app.get('/', (req, res) => res.render('index'));
};
