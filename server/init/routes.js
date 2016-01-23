import passport from 'passport';
import users from '../lib/users';

const passportOptions = {
  successRedirect: '/',
  failureRedirect: '/login'
};

function isLoggedIn(req, res, next) {
  console.log(passport);
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
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

  app.get('/', isLoggedIn, (req, res) => res.render('index', { user: req.user }));
};
