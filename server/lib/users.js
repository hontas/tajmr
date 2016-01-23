import users from '../db/users';

module.exports = {
  post(req, res, next) {
    const { username, password } = req.body;
    console.log('users.post');
    users.add({ username, password })
      .then((user) => {
        console.log('created user', user);
        req.login(user, (err) => {
          if (err) return next(err);
          console.log('logged in');
          res.redirect('/');
        });
      })
      .catch((error) => res.status(500).json({ error: error.toString() }));
  }
};
